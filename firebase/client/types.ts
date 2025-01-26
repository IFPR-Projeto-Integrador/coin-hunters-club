import { Promotion, PromotionReward } from "../promotion/types";
import { Reward } from "../reward/types";
import { CHCUser } from "../user/user";

export interface PromotionsWithRewards extends Promotion {
    rewards: (PromotionReward & { reward: Reward })[];
}

export interface CompaniesWithPromotions {
    company: CHCUser;
    promotions: PromotionsWithRewards[];
}