import shortid from "shortid";
import crypto from "crypto";

import metastore from "../internal/MetaStore";

type Props = {
    path: string
}

type TokenType = "server" | "client";

export class Filebase_TokenManager {

    private _clients: string[] = [];
    private _servers: string[] = [];
    private _path: string;
    ready: boolean = false;

    constructor(props: Props) {
        this._path = props.path + '/_tokens';
        this._startup = this._startup.bind(this);
        this._createToken = this._createToken.bind(this);

        this._startup();
    }

    async count(type: TokenType) {
        if (["server", "client"].indexOf(type) !== -1) {
            if (!this[`_${type}s` as '_clients' | '_servers']) {
                await this._startup();
            }
            return this[`_${type}s` as '_clients' | '_servers'].length;
        }
        throw Error(`Invalid token type ${type}`);
    }

    private _createToken(type: TokenType) {
        if (["server", "client"].indexOf(type) !== -1) {
            let token = `CJ${type === "server" ? 'S' : 'C'}-${shortid.generate()}-${shortid.generate()}`;
            this[`_${type}s` as '_clients' | '_servers'].push(this._getToken(token));
            return token;
        }
        throw Error(`Invalid token type ${type}`);
    }

    async generate(type: TokenType) {
        let token = this._createToken(type);
        await this._save();
        return token;
    }

    async generateMultiple(...types: TokenType[]) {

        let data: {
            clientToken: string[],
            serverToken: string[]
        } =
            { clientToken: [], serverToken: [] }, token: string;
        types.forEach(type => {
            token = this._createToken(type);
            data[`${type}Token` as 'clientToken' | 'serverToken'].push(token)
        })
        await this._save();
        return data;
    }

    validate(type: TokenType, token: string) {
        if (["server", "client"].indexOf(type) !== -1) {
            return this[`_${type}s` as '_clients' | '_servers'].indexOf(this._getToken(token)) !== -1
        }

        throw Error(`Invalid token type ${type}`);
    }

    revoke(type: TokenType, token: string) {
        if (["server", "client"].indexOf(type) !== -1) {
            let index = this[`_${type}s` as '_clients' | '_servers'].indexOf(this._getToken(token));
            if (index === -1) {
                throw Error(`Token ${token} does not exists`);
            }
            this[`_${type}s` as '_clients' | '_servers'].splice(index, 1);
            return true;
        }
        throw Error(`Invalid token type ${type}`);
    }

    private _getToken(token: string) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    private async _startup() {
        let meta = await metastore.get(this._path) as any | undefined;
        this.ready = true;

        if (!meta) return;

        meta.clients && (this._clients = meta.clients);
        meta.servers && (this._servers = meta.servers);
    }

    private _getMeta() {
        return {
            servers: this._servers,
            clients: this._clients
        }
    }

    private async _save() {
        await metastore.save(this._path, this._getMeta());
    }
}