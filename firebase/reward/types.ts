export interface Reward {
    uid?: string;
    name: string;
    imageBase64: string;
    description: string;
}

export enum RewardError {
    // Validation Errors
    NameTooShort, NameTooLong, DescriptionTooShort, DescriptionTooLong, ImageRequired,

    // Repository Errors
    RewardAlreadyExists, RewardDoesNotExist
}

export function rewardErrorToUser(error: RewardError): string {
    switch (error) {
        case RewardError.NameTooShort:
            return "Nome deve ter no mínimo 3 caracteres";
        case RewardError.NameTooLong:
            return "Nome deve ter no máximo 50 caracteres";
        case RewardError.DescriptionTooShort:
            return "Descrição deve ter no mínimo 3 caracteres";
        case RewardError.DescriptionTooLong:
            return "Descrição deve ter no máximo 500 caracteres";
        case RewardError.ImageRequired:
            return "Imagem é obrigatória";
        case RewardError.RewardAlreadyExists:
            return "Recompensa já existe";
        case RewardError.RewardDoesNotExist:
            return "Recompensa não existe";
    }
}

export const rewardCollection = "rewards";