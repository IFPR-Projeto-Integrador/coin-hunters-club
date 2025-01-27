import db from "@/firebase/config";
import { CHCUser } from "../user/user";
import { asyncGetPromotionReward, asyncGetUserPromotions, asyncUpdatePromotionRewardStock } from "../promotion/repository";
import { Promotion, promotionCollection, PromotionReward } from "../promotion/types";
import { ClientWallet, CompaniesWithPromotions, promotionClientCollection, PromotionClientError, PromotionsWithRewards, reservationCollection, RewardReservation, RewardReservationState } from "./types";
import { asyncGetManyRewardsById, asyncGetRewardById } from "../reward/repository";
import { Reward } from "../reward/types";
import { genReservationCode } from "@/helper/codes";
import { Timestamp } from "firebase/firestore";
import { isOneHourInThePast, isOneMinuteInThePast } from "@/helper/dates";

const asyncGetClientWalletMemoized = new Map<string, ClientWallet>();
export async function asyncGetClientWallet(uidCompany: string, uidPromotion: string, uidUser: string): Promise<ClientWallet> {
    if (asyncGetClientWalletMemoized.has(`${uidCompany}-${uidPromotion}-${uidUser}`)) {
        return asyncGetClientWalletMemoized.get(`${uidCompany}-${uidPromotion}-${uidUser}`)!;
    }

    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, promotionClientCollection);
    const query = db.query(collectionRef, db.where("uidClient", "==", uidUser));
    let wallet = (await db.getDocs(query)).docs.map(doc => doc.data() as ClientWallet)[0];

    if (!wallet) {
        wallet = {
            uid: "",
            uidClient: uidUser,
            uidPromotion: uidPromotion,
            coins: 0
        }

        const docRef = await db.addDoc(collectionRef, wallet);
        await db.setDoc(docRef, { uid: docRef.id }, { merge: true });

        wallet.uid = docRef.id;
    }

    asyncGetClientWalletMemoized.set(`${uidCompany}-${uidPromotion}-${uidUser}`, wallet);
    
    return wallet;
}

export async function asyncGetReservationForReward(uidCompany: string, uidPromotion: string, uidUser: string, uidReward: string): Promise<RewardReservation | null> {
    const wallet = await asyncGetClientWallet(uidCompany, uidPromotion, uidUser);
    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, reservationCollection);
    const query = db.query(collectionRef, 
        db.where("uidClientWallet", "==", wallet.uid), 
        db.where("uidReward", "==", uidReward),
        db.where("state", "==", RewardReservationState.reserved));
    const reservationDoc = await db.getDocs(query);

    if (reservationDoc.docs.length === 0) {
        return null;
    }

    const reservation = reservationDoc.docs[0].data() as RewardReservation;

    if (isOneMinuteInThePast(reservation.dtReservation.toDate(), new Date(Date.now())) && reservation.state === RewardReservationState.reserved) {
        const reward = await asyncGetPromotionReward(uidCompany, uidPromotion, uidReward);

        if (!reward) {
            throw new Error("Reward for uidReward in asyncGetReservationForReward was null.")
        }

        await asyncExpireReservation(uidCompany, uidPromotion, reward, wallet);
        return null;
    }

    if (reservation.state === RewardReservationState.expired) {
        return null;
    }

    return reservation ?? null;
}

export async function asyncExpireReservation(uidCompany: string, uidPromotion: string, reward: PromotionReward, wallet: ClientWallet): Promise<void> {
    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, reservationCollection);
    const query = db.query(collectionRef, 
        db.where("uidClientWallet", "==", wallet.uid), 
        db.where("uidReward", "==", reward.uidReward!),
        db.where("state", "==", RewardReservationState.reserved));
    const reservationDoc = (await db.getDocs(query)).docs[0];
    const reservation = reservationDoc.data() as RewardReservation;

    await db.setDoc(reservationDoc.ref, { state: RewardReservationState.expired }, { merge: true });
    await asyncUpdateWallet(uidCompany, uidPromotion, wallet.uidClient, wallet.coins + (reward.unitPrice * reservation.amountReserved));
    await asyncUpdatePromotionRewardStock(uidCompany, uidPromotion, reward.uidReward!, reward.stock + reservation.amountReserved);
}

export async function asyncGetTotalBoughtRewards(uidCompany: string, uidPromotion: string, uidClientWallet: string, uidReward: string): Promise<number> {
    debugger;
    console.log("Teste")
    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, reservationCollection);
    const query = db.query(collectionRef, 
            db.where("uidClientWallet", "==", uidClientWallet), 
            db.where("uidReward", "==", uidReward),
            db.where("state", "!=", RewardReservationState.expired));

    const reservations = (await db.getDocs(query)).docs.map(doc => doc.data() as RewardReservation);

    return reservations.reduce((acc, reservation) => acc + reservation.amountReserved, 0);
}

export async function asyncUpdateWallet(uidCompany: string, uidPromotion: string, uidUser: string, coins: number): Promise<void> {
    const wallet = await asyncGetClientWallet(uidCompany, uidPromotion, uidUser);
    wallet.coins = coins;

    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, promotionClientCollection);
    const query = db.query(collectionRef, db.where("uidClient", "==", uidUser));
    const walletDoc = (await db.getDocs(query)).docs[0];

    await db.setDoc(walletDoc.ref, wallet, { merge: true });
}

export async function asyncGetReservationByCode(uidCompany: string, uidPromotion: string, code: string): Promise<RewardReservation | null> {
    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, reservationCollection);
    const query = db.query(collectionRef, db.where("reservationCode", "==", code));
    const reservation = (await db.getDocs(query)).docs.map(doc => doc.data() as RewardReservation)[0];

    return reservation ?? null;

}

export async function asyncReserveReward(uidCompany: string, uidPromotion: string, uidUser: string, uidReward: string, amount: number)
    : Promise<PromotionClientError | RewardReservation> {
    
    debugger;
    console.log("Teste");
    const wallet = await asyncGetClientWallet(uidCompany, uidPromotion, uidUser);
    const reward = await asyncGetPromotionReward(uidCompany, uidPromotion, uidReward);
    
    if (!reward) {
        return PromotionClientError.rewardNotFound;
    }

    if (wallet.coins < reward.unitPrice * amount) {
        return PromotionClientError.notEnoughCoins;
    }

    if (reward.stock < amount) {
        return PromotionClientError.notEnoughStock;
    }

    if (amount === 0) {
        return PromotionClientError.cannotReserveZero;
    }

    if (amount > 99) {
        return PromotionClientError.cannotReserveMoreThan99;
    }

    if (amount > reward.limitPerUser) {
        return PromotionClientError.cannotReserveMoreThanLimitPerUser;
    }

    const totalBought = await asyncGetTotalBoughtRewards(uidCompany, uidPromotion, wallet.uid, uidReward);

    if (totalBought + amount > reward.limitPerUser) {
        return PromotionClientError.cannotReserveMoreThanLimitPerUser;
    }

    let code = genReservationCode();

    while (await asyncGetReservationByCode(uidCompany, uidPromotion, code)) {
        code = genReservationCode();
    }

    const reservation: RewardReservation = {
        uid: "",
        uidClientWallet: wallet.uid,
        uidPromotion: uidPromotion,
        uidReward: uidReward,
        dtReservation: Timestamp.fromDate(new Date(Date.now())),
        amountReserved: amount,
        reservationCode: code,
        state: RewardReservationState.reserved
    }

    const collectionRef = db.collection(db.store, "usuarios", uidCompany, promotionCollection, uidPromotion, reservationCollection);
    const docRef = await db.addDoc(collectionRef, reservation);
    await db.setDoc(docRef, { uid: docRef.id }, { merge: true });

    await asyncUpdateWallet(uidCompany, uidPromotion, uidUser, wallet.coins - (reward.unitPrice * amount));
    await asyncUpdatePromotionRewardStock(uidCompany, uidPromotion, uidReward, reward.stock - amount);

    return reservation;
}

export async function asyncGetAllCompaniesForClient(): Promise<CompaniesWithPromotions[]> {
    const collectionRef = db.collection(db.store, "usuarios");
    const usersQuery = db.query(collectionRef, db.where("tipoUsuario", "==", "empresa"));
    const allUsers = await db.getDocs(usersQuery);

    let allCompaniesWithPromotions = [] as (CHCUser & { promotions?: (Promotion)[] })[];

    for (const user of allUsers.docs) {
        const company = user.data() as CHCUser;
        const userPromotions = await asyncGetUserPromotions(company, { onlyActiveOnes: true });
        
        allCompaniesWithPromotions.push({
            ...company,
            promotions: userPromotions
        });
    }

    const allRewardIds = new Map<string, Reward>();
    allCompaniesWithPromotions.forEach(company => {
        company.promotions?.forEach(promotion => {
            promotion.rewards.forEach(reward => {
                allRewardIds.set(reward.uidReward, null!);
            });
        });
    });

    const allRewards = await asyncGetManyRewardsById(Array.from(allRewardIds.keys()));

    allRewards.forEach(reward => {
        allRewardIds.set(reward.uid!, reward);
    });

    let allCompaniesWithPromotionsWithRewards = await Promise.all(allCompaniesWithPromotions.map(async company => {
        const promotionsWithRewards: PromotionsWithRewards[] = await Promise.all(company.promotions?.map(async promotion => {
            return {
                ...promotion,
                wallet: await asyncGetClientWallet(company.uid!, promotion.uid!, db.auth.currentUser!.uid),
                rewards: await Promise.all(promotion.rewards.map(async promotionReward => {
                    return {
                        ...promotionReward,
                        reservation: await asyncGetReservationForReward(company.uid!, promotion.uid!, db.auth.currentUser!.uid, promotionReward.uidReward),
                        reward: allRewardIds.get(promotionReward.uidReward)!
                    }
                }))
            }
        })!);

        delete company.promotions;
        delete company.deleted;

        const result: CompaniesWithPromotions = {
            company: company,
            promotions: promotionsWithRewards
        };

        return result;
    }))

    allCompaniesWithPromotionsWithRewards = allCompaniesWithPromotionsWithRewards.filter(company => company.promotions?.length! > 0);

    return allCompaniesWithPromotionsWithRewards;
}