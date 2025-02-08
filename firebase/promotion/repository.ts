import { CHCUser } from "../user/user";
import { Promotion, promotionCollection, PromotionError, PromotionReward } from "./types";
import db from "@/firebase/config";
import { isValidPromotion, promotionRunning, validatePromotion } from "./validation";

interface AsyncGetUserPromotionsOptions { onlyActiveOnes?: boolean}
export async function asyncGetUserPromotions(user: CHCUser | string, options?: AsyncGetUserPromotionsOptions): Promise<Promotion[]> {
    let idUser;
    if (typeof user == "string") {
        idUser = user;
    } else {
        idUser = user.uid;
    }

    const collectionRef = db.collection(db.store, "usuarios", idUser, promotionCollection);

    const allRewards = await db.getDocs(collectionRef);

    let promotions = allRewards.docs.map(doc => doc.data() as Promotion);

    // RN 13
    if (options?.onlyActiveOnes) {
        promotions = promotions.filter(promotion => promotionRunning(promotion));
    }
    
    return promotions;
}

export async function asyncGetPromotionReward(user: CHCUser | string, promotion: Promotion | string, rewardUid: string): Promise<PromotionReward | null> {
    let idUser;
    if (typeof user == "string") {
        idUser = user;
    } else {
        idUser = user.uid;
    }

    let idPromotion;
    if (typeof promotion == "string") {
        idPromotion = promotion;
    } else {
        idPromotion = promotion.uid!;
    }

    const docRef = db.doc(db.store, "usuarios", idUser, promotionCollection, idPromotion);

    const doc = await db.getDoc(docRef);

    if (!doc.exists) {
        return null;
    }

    const promotionDocument = doc.data() as Promotion;

    const reward = promotionDocument.rewards.find(reward => reward.uidReward == rewardUid);

    return reward ?? null;
}

export async function asyncUpdatePromotionRewardStock(user: CHCUser | string, promotion: Promotion | string, rewardUid: string, newStock: number): Promise<Promotion | PromotionError> {
    let idUser;
    if (typeof user == "string") {
        idUser = user;
    } else {
        idUser = user.uid;
    }

    let idPromotion;
    if (typeof promotion == "string") {
        idPromotion = promotion;
    } else {
        idPromotion = promotion.uid!;
    }

    const docRef = db.doc(db.store, "usuarios", idUser, promotionCollection, idPromotion ?? "");

    const docPromotion = (await db.getDoc(docRef)).data() as Promotion | undefined;

    if (docPromotion == undefined)
        return PromotionError.PromotionDoesNotExist;

    const reward = docPromotion.rewards.find(reward => reward.uidReward == rewardUid);

    if (reward == undefined)
        return PromotionError.RewardCannotBeNull;

    reward.stock = newStock;

    await db.setDoc(docRef, docPromotion);

    return docPromotion;
}

export async function asyncGetPromotion(user: CHCUser, uid: string): Promise<Promotion | null> {
    const docRef = db.doc(db.store, "usuarios", user.uid, promotionCollection, uid);

    const doc = await db.getDoc(docRef);

    if (!doc.exists) {
        return null;
    }

    return doc.data() as Promotion;
}

export async function asyncGetPromotionName(uidCompany: string, uidPromotion: string): Promise<string | null> {
    const promotionDocRef = db.doc(
        db.store,
        "usuarios",
        uidCompany,
        promotionCollection,
        uidPromotion
    );

    const promotionDoc = await db.getDoc(promotionDocRef);

    if (promotionDoc.exists()) {
        const promotion = promotionDoc.data() as Promotion;
        return promotion.name;
    } else {
        return null;
    }
}

export async function asyncCreatePromotion(promotion: Promotion, client: CHCUser): Promise<Promotion | PromotionError[]> {
    if (!isValidPromotion(promotion)) {
        const errors = validatePromotion(promotion);
        return errors;
    }

    if (promotion.uid != null) {
        return [PromotionError.PromotionAlreadyExists];
    }

    const allPromotions = await asyncGetUserPromotions(client);
    const overlappingPromotion = allPromotions.find(existingPromotion => 
        promotion.dtStart <= existingPromotion.dtEnd && promotion.dtEnd >= existingPromotion.dtStart);

    // RN 06 - Apenas uma promoção pode estar ativa por vez (Não permite multiplas promoções no mesmo período, o que significa que apenas uma
    // pode existir no mesmo período)
    if (overlappingPromotion) {
        return [PromotionError.PromotionOverlaps];
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

// RN 07 - Não é possível editar a conversão da promoção
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