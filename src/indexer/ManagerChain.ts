
import { IndexChain } from "./IndexChain";
import IndexValue from "./IndexValue";
import IndexFulltext from "./IndexFulltext";

type Props = {
    indexes: (IndexValue | IndexFulltext)[]
}

export class ManagerChain {

    batchIndexes: IndexChain[];

    constructor(props: Props) {
        this.batchIndexes = props.indexes.map(item => item.batch());
    }

    put(id: string, object: any) {
        this.batchIndexes.forEach(item => item.put(id, object));
    }

    remove(id: string) {

    }

    commit() {
        return Promise.all(this.batchIndexes.map(item => item.commit()));
    }
}