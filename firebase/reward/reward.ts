import { CHCUser } from "../user/user";
import { IReward } from "./types";

export default class Reward implements IReward {
    uid: string;
    nome: string;
    imagem: string;
    descricao: string;

    constructor(nome: string, imagem: string, descricao: string, uid: string | undefined) {
        this.uid = uid ?? "";
        this.nome = nome;
        this.imagem = imagem;
        this.descricao = descricao;
    }
    
    static asyncGetRewards(client: CHCUser): Promise<IReward[]> {
        
        return new Promise((resolve, reject) => resolve([]));

    }
}