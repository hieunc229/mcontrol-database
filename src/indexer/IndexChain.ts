import { LevelUpChain } from "levelup";
import { to16Chars } from "../utils";

type IndexperBatchProps = {
    batch: LevelUpChain,
    property: string
}
export class IndexChain {
    _batch: LevelUpChain;
    _property: string;

    constructor(props: IndexperBatchProps) {
        this._batch = props.batch;
        this._property = props.property;
        this.put = this.put.bind(this);
    }

    put(id: string, object: any) {
        this.appendProp({
            batch: this._batch,
            property: this._property,
            id, parentProp: "", object
        })
    }

    del(id: string, removes: any) {

        Object.keys(removes).forEach(prop => {
            let value = removes[prop];
            switch (typeof removes[prop]) {
                case "boolean":
                    this._batch.del(`${value ? '1' : '0'}:${id}`);
                    break;
                case "string":
                    // this._batch.del(`${value}:${id}`);
                    this._batch.del(`${value.toLowerCase()}:${id}`);
                    break;
                case "number":
                    this._batch.del(`${value}:${id}`);
                    break;
            }
        })
    }

    commit() {
        return this._batch.write()
    }

    private appendProp(opts: {
        batch: LevelUpChain,
        object: any,
        property: string,
        parentProp: string,
        id: string
    }) {
        const value = opts.object[opts.property];
        const id = opts.id;

        switch (typeof value) {
            case "boolean":
                opts.batch.put(`${opts.parentProp}${value ? '1' : '0'}:${id}`, true);
                break;
            case "string":
                // opts.batch.put(`${opts.parentProp}${value}:${id}`, true);
                opts.batch.put(`${opts.parentProp}${value.toLowerCase()}:${id}`, true);
                break;
            case "number":
                opts.batch.put(`${opts.parentProp}${to16Chars(value)}:${id}`, true);
                break;
            case "object":
                if (Array.isArray(value)) {
                    value.forEach(arrayValue => {
                        opts.batch.put(`${opts.parentProp}a:${arrayValue}:${id}`, true);
                    })
                } else {
                    Object.keys(value).forEach(prop => {
                        this.appendProp({
                            parentProp: opts.parentProp + opts.property + ':',
                            property: opts.property,
                            object: value[prop],
                            id,
                            batch: opts.batch
                        })
                    })
                }
                break;
        }
    }
}