import IndexValue from "./IndexValue";
import IndexFulltext from "./IndexFulltext";
import { ManagerChain } from "./ManagerChain";
export declare type Index = {
    property: string;
    type?: "regular" | "fulltext";
};
declare type Props = {
    path: string;
    indexes?: Index[];
};
export default class IndexManager {
    _path: string;
    _indexes: (IndexValue | IndexFulltext)[];
    _metaPath: string;
    constructor(props: Props);
    insert(id: string, object: any): Promise<any>;
    update(id: string, object: any, removes: any): Promise<any>;
    batch(): ManagerChain;
    createIndex(property: string, type?: "regular" | "fulltext"): IndexValue | IndexFulltext | undefined;
    removeIndex(property: string): Promise<boolean>;
    destroy(): Promise<void[]>;
    getStore(property: string, type?: "regular" | "fulltext"): IndexValue | IndexFulltext;
    private updateMeta;
    private startup;
}
export {};
