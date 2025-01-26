import db from "@/firebase/config";
import { CHCUser } from "../user/user";
import { asyncGetUserPromotions } from "../promotion/repository";
import { Promotion, PromotionReward } from "../promotion/types";
import { CompaniesWithPromotions, PromotionsWithRewards } from "./types";
import { asyncGetManyRewardsById } from "../reward/repository";
import { Reward } from "../reward/types";

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

    const allCompaniesWithPromotionsWithRewards = allCompaniesWithPromotions.map(company => {
        const promotionsWithRewards: PromotionsWithRewards[] = company.promotions?.map(promotion => {
            return {
                ...promotion,
                rewards: promotion.rewards.map(promotionReward => {
                    return {
                        ...promotionReward,
                        reward: allRewardIds.get(promotionReward.uidReward)!
                    }
                })
            }
        })!;

        delete company.promotions;
        delete company.deleted;

        const result: CompaniesWithPromotions = {
            company: company,
            promotions: promotionsWithRewards
        };

        return result;
    })

    return allCompaniesWithPromotionsWithRewards;
}