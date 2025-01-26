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

export async function asyncGetManyRewardsById(rewardIds: string[]): Promise<Reward[]> {
    if (rewardIds.length == 0) {
        return [];
    }

    const collectionRef = db.collection(db.store, "usuarios");
    const usersQuery = db.query(collectionRef, db.where("tipoUsuario", "==", "empresa"));
    const allEmpresas = await db.getDocs(usersQuery);
    const allIds = allEmpresas.docs.map(doc => doc.id);

    const rewards = [] as Reward[];

    for (const id of allIds) {
        const query = db.query(db.collection(db.store, "usuarios", id, rewardCollection),
        db.where(db.documentId(), "in", rewardIds));
        const reward = (await db.getDocs(query)).docs.map(doc => doc.data() as Reward);

        for (const r of reward) {
            rewards.push(r);
        }
    }

    return rewards;
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