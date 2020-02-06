import DatabaseManager from ".";
import { Index } from "./indexer/indexManager";
export default class ProjectManager {
    private _projects;
    private location;
    private _metaPath;
    private _config;
    constructor(props: {
        location: string;
    });
    get: (name: string) => DatabaseManager;
    create(name: string, opts?: {
        name: string;
        indexes?: (string | Index)[];
        autoIndexEnabled?: boolean;
    }[]): DatabaseManager;
    list(): any[];
    config(key: "setupComplete"): any;
    saveMeta: () => Promise<void>;
    private _saveMeta;
    private _startup;
}
