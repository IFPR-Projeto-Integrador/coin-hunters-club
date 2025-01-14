import { Timestamp } from "firebase/firestore";

export interface Promotion {
    uid?: string;
    nome: string;
    dtInicio: Timestamp;
    dtFim: Timestamp;
    conversao: number;
    recompensas: PromotionReward[];
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