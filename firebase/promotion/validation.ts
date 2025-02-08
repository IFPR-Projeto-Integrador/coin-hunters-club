import { roundToNearestDay } from "@/helper/dates";
import { Reward } from "../reward/types";
import { Promotion, PromotionError, PromotionReward } from "./types";
import { Timestamp } from "firebase/firestore";

export function validatePromotion(reward: Promotion): PromotionError[] {
    const errors: PromotionError[] = [];

    errors.push(...validPromotionName(reward.name));
    errors.push(...validPromotionDate(reward.dtStart, reward.dtEnd));
    errors.push(...validConversion(reward.conversion));
    errors.push(...validPromotionRewardList(reward.rewards));
    errors.push(...reward.rewards.map(validPromotionReward).flat());

    return errors;
}

export function isValidPromotion(reward: Promotion): boolean {
    return validatePromotion(reward).length == 0;
}

export function validPromotionName(rewardName: string): PromotionError[] {
    const errors: PromotionError[] = [];

    // RN 33 - Impede com que o nome da promoção seja menor que 3 caracteres
    if (rewardName.length < 3) {
        errors.push(PromotionError.PromotionNameTooLong);
    }
    // RN 32 - Impede com que o nome da promoção seja maior que 50 caracteres
    if (rewardName.length > 50) {
        errors.push(PromotionError.PromotionNameTooLong);
    }

    return errors;
}

export function validPromotionDate(promotionDtInicio: Timestamp, promotionDtFim: Timestamp): PromotionError[] {
    const errors: PromotionError[] = [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // RN 24 - Impede com que uma promoção seja criada no passado
    if (roundToNearestDay(promotionDtInicio.toDate()) < now || roundToNearestDay(promotionDtFim.toDate()) < now) {
        errors.push(PromotionError.PromotionCannotBeInThePast);
    }

    // RN 12 - Não permite com que a data final seja antes da data inicial
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

export function validPromotionRewardList(reward: PromotionReward[]): PromotionError[] {
    const errors: PromotionError[] = [];

    if (reward == null) {
        errors.push(PromotionError.RewardCannotBeNull);
    }

    // RN 26 - Não permite promoções sem recompensas
    if (reward.length == 0) {
        errors.push(PromotionError.ThereMustBeAtLeastOneReward);
    }

    return errors;
}

export function validPromotionReward(reward: PromotionReward): PromotionError[] {
    const errors: PromotionError[] = [];

    if (reward.stock <= 0 || isNaN(reward.stock)) {
        errors.push(PromotionError.StockMustBeAboveZero);
    }

    if (reward.unitPrice <= 0 || isNaN(reward.unitPrice)) {
        errors.push(PromotionError.UnitPriceMustBeAboveZero);
    }

    if (reward.limitPerUser <= 0 || isNaN(reward.limitPerUser)) {
        errors.push(PromotionError.LimitPerUserMustBeAboveZero);
    }

    return errors;
}

export function promotionEnded(promotion: Promotion): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return roundToNearestDay(promotion.dtEnd.toDate()).getTime() < now.getTime();
}

export function promotionBegun(promotion: Promotion): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0)
    return roundToNearestDay(promotion.dtStart.toDate()).getTime() <= now.getTime();
}

// RN 13 - Define que a promoção está ativa com base nas datas. Usado pelo código.
export function promotionRunning(promotion: Promotion): boolean {
    return promotionBegun(promotion) && !promotionEnded(promotion);
}