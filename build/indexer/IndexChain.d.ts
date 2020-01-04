import { LevelUpChain } from "levelup";
declare type IndexperBatchProps = {
    batch: LevelUpChain;
    property: string;
};
export declare class IndexChain {
    _batch: LevelUpChain;
    _property: string;
    constructor(props: IndexperBatchProps);
    put(id: string, object: any): void;
    del(id: string, removes: any): void;
    commit(): Promise<LevelUpChain<any, any>>;
    private appendProp;
}
export {};
