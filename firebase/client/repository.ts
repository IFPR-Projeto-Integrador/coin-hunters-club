import db from "@/firebase/config";
import { CHCUser } from "../user/user";
import { asyncGetUserPromotions } from "../promotion/repository";
import { Promotion, promotionCollection, PromotionReward } from "../promotion/types";
import { ClientWallet, CompaniesWithPromotions, promotionClientCollection, PromotionsWithRewards } from "./types";
import { asyncGetManyRewardsById } from "../reward/repository";
import { Reward } from "../reward/types";

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
                rewards: promotion.rewards.map(promotionReward => {
                    return {
                        ...promotionReward,
                        reward: allRewardIds.get(promotionReward.uidReward)!
                    }
                })
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