declare type Props = {
    path: string;
};
declare type TokenType = "server" | "client";
export declare class Filebase_TokenManager {
    private _clients;
    private _servers;
    private _path;
    ready: boolean;
    constructor(props: Props);
    count(type: TokenType): Promise<number>;
    private _createToken;
    generate(type: TokenType): Promise<string>;
    generateMultiple(...types: TokenType[]): Promise<{
        clientToken: string[];
        serverToken: string[];
    }>;
    validate(type: TokenType, token: string): boolean;
    revoke(type: TokenType, token: string): boolean;
    private _getToken;
    private _startup;
    private _getMeta;
    private _save;
}
export {};
