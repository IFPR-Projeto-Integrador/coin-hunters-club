export interface Reward {
    uid?: string;
    nome: string;
    imagem: string;
    descricao: string;
}

export enum RewardError {
    // Validation Errors
    NameTooShort, NameTooLong, DescriptionTooShort, DescriptionTooLong,

    // Repository Errors
    RewardAlreadyExists, RewardDoesNotExist
}

export const rewardCollection = "rewards";