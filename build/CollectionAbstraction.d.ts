import Collection, { CollectionInterface } from "./Collection";
export default class CollectionAbstraction {
    private _c;
    onObjectWillInsert(object: any): any;
    onObjectWillUpdate(id: string, object: any): any;
    onObjectWillRemove(id: string): string;
    onObjectWillSet(id: string, object: any): any;
    constructor(props: CollectionInterface);
    insert(object: {
        [prop: string]: any;
    }): Promise<string>;
    set(id: string, object: {
        [prop: string]: any;
    }): Promise<any>;
    update(id: string, changes: {
        [prop: string]: any;
    }): Promise<unknown>;
    remove(id: string): Promise<any>;
    get(id: string): Promise<import("./Collection").RecordInterface>;
    c(): Collection;
}
