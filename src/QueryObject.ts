import { LevelUp } from "levelup";
import { to16Chars } from "./utils";
import { FetchResult } from "./Collection";


export class QueryObject {

    __store: LevelUp;
    __opts: {
        gt?: string | number,
        lt?: string | number,
        gte?: string | number,
        lte?: string | number,
        start?: string | number,
        end?: string | number,
        arrayContains?: string | number,
        limit?: number,
        reverse?: boolean
    } = {};
    __eq?: {
        gte?: string,
        lte?: string
    }
    __prop: string = "";

    constructor(indexStore: LevelUp) {
        this.__store = indexStore;
        this.range = this.range.bind(this);
        this.filter = this.filter.bind(this);
        this.get = this.get.bind(this);
        this.limit = this.limit.bind(this);
    }

    range(opts: { start?: string | number, end?: string | number }): QueryObject {
        opts.start && (
            this.__opts.start = typeof opts.start === "string" ?
                `${opts.start}` :
                `${to16Chars(opts.start)}`
        )

        opts.end && (
            this.__opts.end = typeof opts.end === "string" ?
                `${opts.end}` :
                `${to16Chars(opts.end)}`
        )

        return this;
    }

    filter(opts: { gt?: string | number, lt?: string | number, gte?: string | number, lte?: string | number }): QueryObject {
        opts.gt && (
            this.__opts.gt = typeof opts.gt === "string" ?
                `${opts.gt}` :
                `${to16Chars(opts.gt)}`
        )

        opts.gte && (
            this.__opts.gte = typeof opts.gte === "string" ?
                `${opts.gte}:0` :
                `${to16Chars(opts.gte)}:0`
        )

        opts.lt && (
            this.__opts.lt = typeof opts.lt === "string" ?
                `${opts.lt}` :
                `${to16Chars(opts.lt)}`
        );

        opts.lte && (
            this.__opts.lte = typeof opts.lte === "string" ?
                `${opts.lte}:zzzzzzzzzzzzzz` :
                `${to16Chars(opts.lte)}:zzzzzzzzzzzzzz`
        );

        return this;
    }

    eq(value: string | number | boolean): QueryObject {
        let v: string;

        switch (typeof value) {
            case "boolean":
                v = value ? '1' : '0';
                break;
            case 'number':
                v = to16Chars(value);
                break;
            default:
                v = value;
        }
        if (!this.__eq) this.__eq = {};

        this.__eq.gte = `${v}:0`;
        this.__eq.lte = `${v}:zzzzzzzzzzzzzz`;
        
        return this;
    }

    arrayContains(value: string | number): QueryObject {
        this.__opts.gte = typeof value === "string" ?
            `a:${value}:0` : // smallest value in 'shortid'
            `a:${to16Chars(value)}:0`;

        this.__opts.lte = typeof value === "string" ?
            `a:${value}:zzzzzzzzzzzzzz` : // highest value in 'shortid'
            `a:${to16Chars(value)}:zzzzzzzzzzzzzz`;
        return this;
    }

    limit(number: number): QueryObject {
        this.__opts.limit = number;
        return this;
    }

    reverse(isReverse?: boolean): QueryObject {
        this.__opts.reverse = isReverse === undefined ? true : isReverse;
        return this;
    }

    get = (_opts?: { values: boolean }): Promise<FetchResult> => {

        return new Promise(async (resolve, reject) => {

            !this.__store.isOpen() && await this.__store.open();

            let results: FetchResult = {
                keys: [],
                docs: [],
                errors: []
            }
            let request: any;
            let opts = Object.assign(this.__opts, _opts);
            
            // if (Object.keys(opts).length) {
            //     request = await getStream(opts, this.__store);
            //     results.keys = request.keys;
            //     results.docs = request.docs;
            //     results.errors = request.errors;
            // }

            if (this.__eq) {
                request = await getStream(Object.assign({ values: false }, this.__eq, _opts), this.__store);
                results.docs = results.docs.concat(request.docs);
                results.errors = results.errors.concat(request.errors);
                results.keys = results.keys.concat(request.keys);
            } else if (Object.keys(opts).length) {
                request = await getStream(opts, this.__store);
                results.keys = request.keys;
                results.docs = request.docs;
                results.errors = request.errors;
            }

            results.keys = results.keys.filter((k, i, list) => list.indexOf(k) === i);
            resolve(results);
        });
    }
}


function getStream(opts: any, store: LevelUp)
    : Promise<{ docs: { id: string, [prop: string]: any }[], errors: any[], keys: string[] }> {
    return new Promise((resolve, reject) => {
        let key: string;
        let docs: { id: string, [prop: string]: any }[] = [];
        let errors: any[] = [], keys: string[] = []

        store.createReadStream(opts)
            .on('data', function (data: any) {
                key = (data.key ? data.key : data).toString('utf8');
                const separator = key.lastIndexOf(':') + 1;
                
                console.log(key, separator, key.substr(separator));
                if (opts.values) {
                    docs.push({
                        id: key.substr(separator),
                        ...JSON.parse(data.value.toString('utf8'))
                    })
                } else {
                    keys.push(key.substr(separator));
                }
            })
            .on('error', function (err) {
                errors.push(err);
            })
            .on('close', function () {
                resolve({ docs, errors, keys });
            });
    });
}