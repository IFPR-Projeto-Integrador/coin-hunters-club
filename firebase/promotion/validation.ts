import { Reward } from "../reward/types";
import { Promotion, PromotionError } from "./types";
import { Timestamp } from "firebase/firestore";

export function validatePromotion(reward: Promotion): PromotionError[] {
    const errors: PromotionError[] = [];

    errors.push(...validPromotionName(reward.name));
    errors.push(...validPromotionDate(reward.dtStart, reward.dtEnd));
    errors.push(...validConversion(reward.conversion));

    return errors;
}

export function isValidPromotion(reward: Promotion): boolean {
    return validatePromotion(reward).length == 0;
}

export function validPromotionName(rewardName: string): PromotionError[] {
    const errors: PromotionError[] = [];

    if (rewardName.length < 3) {
        errors.push(PromotionError.PromotionNameTooLong);
    }
    if (rewardName.length > 50) {
        errors.push(PromotionError.PromotionNameTooLong);
    }

    return errors;
}

export function validPromotionDate(promotionDtInicio: Timestamp, promotionDtFim: Timestamp): PromotionError[] {
    const errors: PromotionError[] = [];

    const now = new Date();

    if (promotionDtInicio.toDate() < now || promotionDtFim.toDate() < now) {
        errors.push(PromotionError.PromotionCannotBeInThePast);
    }

    if (promotionDtFim.toDate() < promotionDtInicio.toDate()) {
        errors.push(PromotionError.EndBeforeIni);
    }

    if (promotionDtFim.toDate() == promotionDtInicio.toDate()) {
        errors.push(PromotionError.IniAndEndEqual);
    }

    return errors;
}

export function validConversion(conversion: number): PromotionError[] {
    const errors: PromotionError[] = [];

    if (conversion <= 0) {
        errors.push(PromotionError.ConversionCannotEqualOrLessZero);
    }

    return errors;
}