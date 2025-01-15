import { Timestamp } from "firebase/firestore";

export interface Promotion {
    uid?: string;
    name: string;
    dtStart: Timestamp;
    dtEnd: Timestamp;
    conversion: number;
    rewards: PromotionReward[];
}

export interface PromotionReward {
    uidReward: string;
    stock: number;
    unitPrice: number;
    limitPerUser: number;
}

export enum PromotionError {
    // Validation Errors
    EndBeforeIni, IniAndEndEqual, PromotionCannotBeInThePast, PromotionNameTooLong, PromotionNameTooShort, ConversionCannotEqualOrLessZero,

    // Repository Errors
    PromotionAlreadyExists, PromotionDoesNotExist
}

export const promotionCollection = "promotions";