import { Reward, RewardError } from "./types";

export function validateReward(reward: Reward): RewardError[] {
    const errors: RewardError[] = [];

    errors.push(...validRewardName(reward.name));
    errors.push(...validRewardDescription(reward.description));
    errors.push(...validRewardImage(reward.imageBase64));

    return errors;
}

export function isValidReward(reward: Reward): boolean {
    return validateReward(reward).length == 0;
}

export function validRewardName(rewardName: string): RewardError[] {
    const errors: RewardError[] = [];

    // RN 30 - Impede com que o nome da recompensa seja menor que 3 caracteres
    if (rewardName.length < 3) {
        errors.push(RewardError.NameTooShort);
    }
    // RN 28 - Impede com que o nome da recompensa seja maior que 50 caracteres
    if (rewardName.length > 50) {
        errors.push(RewardError.NameTooLong);
    }

    return errors;
}

export function validRewardDescription(rewardDescription: string): RewardError[] {
    const errors: RewardError[] = [];

    // RN 31 - Impede com que a descrição da recompensa seja menor que 3 caracteres
    if (rewardDescription.length < 3) {
        errors.push(RewardError.DescriptionTooShort);
    }
    // RN 29 - Impede com que a descrição da recompensa seja maior que 500 caracteres
    if (rewardDescription.length > 500) {
        errors.push(RewardError.DescriptionTooLong);
    }

    return errors;
}

export function validRewardImage(rewardImage: string): RewardError[] {
    const errors: RewardError[] = [];

    if (rewardImage.length == 0 || rewardImage == null || !rewardImage.startsWith("data:image")) {
        errors.push(RewardError.ImageRequired);
    }

    return errors;
}