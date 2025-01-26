import { Promotion, PromotionReward } from "../promotion/types";
import { Reward } from "../reward/types";
import { CHCUser } from "../user/user";

export interface PromotionsWithRewards extends Promotion {
    rewards: (PromotionReward & { reward: Reward })[];
    wallet: ClientWallet;
}

export interface CompaniesWithPromotions {
    company: CHCUser;
    promotions: PromotionsWithRewards[];
}

export interface ClientWallet {
    uid: string;
    uidClient: string;
    uidPromotion: string;
    coins: number;
}

export const promotionClientCollection = "promotion-client";