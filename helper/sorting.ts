import { Promotion } from "@/firebase/promotion/types";
import { promotionRunning } from "@/firebase/promotion/validation";

export function sortByRunning(promotions: Promotion[]): Promotion[] {
    return promotions.sort((a, b) => {
        if (promotionRunning(a) && !promotionRunning(b)) return -1;
        if (!promotionRunning(a) && promotionRunning(b)) return 1;
        return 0;
    });

}