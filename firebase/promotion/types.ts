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
    RewardCannotBeNull, ThereMustBeAtLeastOneReward, StockMustBeAboveZero, UnitPriceMustBeAboveZero, LimitPerUserMustBeAboveZero,

    // Repository Errors
    PromotionAlreadyExists, PromotionDoesNotExist, PromotionOverlaps
}

export function promotionErrorToUser(error: PromotionError): string {
    switch (error) {
        case PromotionError.EndBeforeIni:
            return "Data de término deve ser depois da data de início";
        case PromotionError.IniAndEndEqual:
            return "Data de início e término não podem ser iguais";
        case PromotionError.PromotionCannotBeInThePast:
            return "Promoção não pode estar no passado";
        case PromotionError.PromotionNameTooLong:
            return "Nome da promoção deve ter no máximo 50 caracteres";
        case PromotionError.PromotionNameTooShort:
            return "Nome da promoção deve ter no mínimo 3 caracteres";
        case PromotionError.ConversionCannotEqualOrLessZero:
            return "Conversão deve ser maior que zero";
        case PromotionError.PromotionAlreadyExists:
            return "Promoção já existe";
        case PromotionError.PromotionDoesNotExist:
            return "Promoção não existe";
        case PromotionError.RewardCannotBeNull:
            return "Recompensa não pode ser nula";
        case PromotionError.ThereMustBeAtLeastOneReward:
            return "Deve haver ao menos uma recompensa";
        case PromotionError.StockMustBeAboveZero:
            return "Estoque deve ser maior que zero";
        case PromotionError.UnitPriceMustBeAboveZero:
            return "Preço unitário deve ser maior que zero";
        case PromotionError.LimitPerUserMustBeAboveZero:
            return "Limite por usuário deve ser maior que zero";
        case PromotionError.PromotionOverlaps:
            return "Promoção não pode sobrepor outra promoção";
    }
}

export const promotionCollection = "promotions";