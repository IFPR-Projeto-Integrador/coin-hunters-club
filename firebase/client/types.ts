import { Timestamp } from "firebase/firestore";
import { Promotion, PromotionReward } from "../promotion/types";
import { Reward } from "../reward/types";
import { CHCUser } from "../user/user";

export interface PromotionsWithRewards extends Promotion {
    rewards: (PromotionReward & { reward: Reward, reservation: RewardReservation | null })[];
    wallet: ClientWallet;
}

export interface CompaniesWithPromotions {
    company: CHCUser;
    promotions: PromotionsWithRewards[];
}

export interface UserRedeemedReward {
    dtIniPromotion: Timestamp;
    dtEndPromotion: Timestamp;
    namePromotion: string;
    totalCoinsGained: number;
    redeemedRewards: {
        uidReward: string;
        rewardName: string;
        rewardImageBase64: string;
        amount: number;
    }[]
}

export interface ClientWallet {
    uid: string;
    uidClient: string;
    uidPromotion: string;
    coins: number;
}

export enum RewardReservationState {
    reserved = "reserved",
    expired = "expired",
    redeemed = "redeemed"
}

export interface RewardReservation {
    uid: string;
    uidClientWallet: string;
    uidPromotion: string;
    uidReward: string;
    dtReservation: Timestamp;
    amountReserved: number;
    reservationCode: string;
    state: RewardReservationState;
}

export interface RewardRedeem {
    uid: string;
    uidEmployee: string;
    uidRewardReservation: string;
    dtRedeem: Timestamp;
}

export interface CoinCredit {
    uid: string;
    uidEmployee: string;
    uidClientWallet: string;
    dtTransaction: Timestamp;
    amountSpent: number;
    coinsReceived: number;
}

export enum PromotionClientError {
    notEnoughCoins, rewardNotFound, notEnoughStock, cannotReserveZero, cannotReserveMoreThan99, cannotReserveMoreThanLimitPerUser,
    reservationNotFound, alreadyRedeemed, alreadyExpired, clientNotFound,
    walletNotFound,
    noActivePromotion,
    multipleActivePromotions
}

export function promotionClientErrorToUser(error: PromotionClientError): string {
    switch (error) {
        case PromotionClientError.notEnoughCoins:
            return "Saldo insuficiente";
        case PromotionClientError.rewardNotFound:
            return "Recompensa não encontrada";
        case PromotionClientError.notEnoughStock:
            return "Estoque insuficiente";
        case PromotionClientError.cannotReserveZero:
            return "Não é possível reservar 0 recompensas";
        case PromotionClientError.cannotReserveMoreThan99:
            return "Não é possível reservar mais de 99 recompensas";
        case PromotionClientError.cannotReserveMoreThanLimitPerUser:
            return "Limite por usuário atingido";
        case PromotionClientError.reservationNotFound:
            return "Reserva não encontrada";
        case PromotionClientError.alreadyRedeemed:
            return "Reserva já resgatada";
        case PromotionClientError.alreadyExpired:
            return "Reserva expirada";
        case PromotionClientError.clientNotFound:
            return "Cliente não encontrado";
        case PromotionClientError.walletNotFound:
            return "Carteira não encontrada";
        case PromotionClientError.noActivePromotion:
            return "Nenhuma promoção ativa";
        case PromotionClientError.multipleActivePromotions:
            return "Múltiplas promoções ativas";
    }
}

export const promotionClientCollection = "promotion-client";

export const reservationCollection = "reservations";

export const redeemCollection = "redeems";

export const coinCreditCollection = "coin-credit";