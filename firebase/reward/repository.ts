import { CHCUser } from "../user/user";
import { Reward, rewardCollection, RewardError } from "./types";
import db from "@/firebase/config";
import { isValidReward, validateReward } from "./validation";

export async function asyncGetUserRewards(client: CHCUser): Promise<Reward[]> {
    const collectionRef = db.collection(db.store, "usuarios", client.uid, rewardCollection);

    const allRewards = await db.getDocs(collectionRef);
    
    return allRewards.docs.map(doc => doc.data() as Reward);
}

export async function asyncGetRewardById(rewardId: string, client: CHCUser): Promise<Reward | null> {
    const docRef = db.doc(db.store, "usuarios", client.uid, rewardCollection, rewardId);

    const reward = (await db.getDoc(docRef)).data() as Reward;

    return reward;
}

export async function asyncCreateReward(reward: Reward, client: CHCUser): Promise<Reward | RewardError[]> {
    if (!isValidReward(reward)) {
        const errors = validateReward(reward);
        return errors;
    }

    if (reward.uid != null) {
        return [RewardError.RewardAlreadyExists];
    }

    reward.uid = "";

    const collectionRef = db.collection(db.store, "usuarios", client.uid, rewardCollection);

    const docRef = await db.addDoc(collectionRef, reward);

    await db.setDoc(docRef, { uid: docRef.id }, { merge: true });

    return {
        ...reward,
        uid: docRef.id
    };
}

export async function asyncEditReward(reward: Reward, client: CHCUser): Promise<Reward | null> {
    const docRef = db.doc(db.store, "usuarios", client.uid, rewardCollection, reward.uid ?? "");

    if ((await db.getDoc(docRef)).exists() == false) {
        console.error("Reward does not exist");
        return null;
    }

    await db.setDoc(docRef, reward);

    return reward;
}

export async function asyncDeleteReward(reward: Reward, client: CHCUser) {
    const docRef = db.doc(db.store, "usuarios", client.uid, rewardCollection, reward.uid ?? "");

    if ((await db.getDoc(docRef)).exists() == false) {
        console.error("Reward does not exist");
        return;
    }

    await db.deleteDoc(docRef);
}