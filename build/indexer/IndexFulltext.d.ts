import Collection from "../Collection";
import { LevelUp } from "levelup";
import { IndexChain } from "./IndexChain";
declare type Props = {
    path: string;
    property: string;
};
export default class IndexFulltext {
    _store: LevelUp;
    _path: string;
    _prop: string;
    constructor(props: Props);
    put(id: string, object: any): Promise<import("levelup").LevelUpChain<any, any>>;
    del(id: string, removes: any): Promise<import("levelup").LevelUpChain<any, any>>;
    batch(): IndexChain;
    getMeta(): {
        property: string;
        type: string;
    };
    startIndexing(col: Collection): Promise<void>;
    destroy(): Promise<void>;
}
export {};
