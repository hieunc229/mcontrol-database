import { IndexChain } from "./IndexChain";
import IndexValue from "./IndexValue";
import IndexFulltext from "./IndexFulltext";
declare type Props = {
    indexes: (IndexValue | IndexFulltext)[];
};
export declare class ManagerChain {
    batchIndexes: IndexChain[];
    constructor(props: Props);
    put(id: string, object: any): void;
    remove(id: string): void;
    commit(): Promise<import("levelup").LevelUpChain<any, any>[]>;
}
export {};
