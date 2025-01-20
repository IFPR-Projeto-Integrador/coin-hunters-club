import { CHCUser } from "../user/user";
import { Promotion, promotionCollection, PromotionError } from "./types";
import db from "@/firebase/config";
import { isValidPromotion, validatePromotion } from "./validation";

export async function asyncGetPromotions(user: CHCUser): Promise<Promotion[]> {
    const collectionRef = db.collection(db.store, "usuarios", user.uid, promotionCollection);

    const allRewards = await db.getDocs(collectionRef);
    
    return allRewards.docs.map(doc => doc.data() as Promotion);
}

export async function asyncGetPromotion(user: CHCUser, uid: string): Promise<Promotion | null> {
    const docRef = db.doc(db.store, "usuarios", user.uid, promotionCollection, uid);

    const doc = await db.getDoc(docRef);

    if (!doc.exists) {
        return null;
    }

    return doc.data() as Promotion;
}

export async function asyncCreatePromotion(promotion: Promotion, client: CHCUser): Promise<Promotion | PromotionError[]> {
    if (!isValidPromotion(promotion)) {
        const errors = validatePromotion(promotion);
        return errors;
    }

    if (promotion.uid != null) {
        return [PromotionError.PromotionAlreadyExists];
    }

    promotion.uid = "";

    const collectionRef = db.collection(db.store, "usuarios", client.uid, promotionCollection);

    const docRef = await db.addDoc(collectionRef, promotion);

    await db.setDoc(docRef, { uid: docRef.id }, { merge: true });

    return {
        ...promotion,
        uid: docRef.id
    };
}

export async function asyncEditPromotionName(promotion: Promotion, client: CHCUser, newName: string): Promise<Promotion | PromotionError> {
    const docRef = db.doc(db.store, "usuarios", client.uid, promotionCollection, promotion.uid ?? "");

    const docPromotion = (await db.getDoc(docRef)).data() as Promotion | undefined;

    if (docPromotion == undefined)
        return PromotionError.PromotionDoesNotExist;

    docPromotion.name = newName;

    await db.setDoc(docRef, docPromotion);

    return promotion;
}

export async function asyncDeletePromotion(promotion: Promotion, client: CHCUser): Promise<undefined | PromotionError> {
    const docRef = db.doc(db.store, "usuarios", client.uid, promotionCollection, promotion.uid ?? "");

    if ((await db.getDoc(docRef)).exists() == false) {
        return PromotionError.PromotionDoesNotExist;
    }

    await db.deleteDoc(docRef);
}