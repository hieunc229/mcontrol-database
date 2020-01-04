import Collection from "./Collection";
interface ProviderInterface {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
    enabled: boolean;
}
interface ProvidersInterface {
    [name: string]: ProviderInterface;
}
interface AuthProps {
    location: string;
    providers: ProvidersInterface;
}
declare type AuthProvider = "facebook" | "google" | "email";
interface UserInfo {
    id: string;
    provider: AuthProvider;
    photoURL: string;
    email: string;
    username?: string;
    password?: string;
    pid?: string;
    firstName?: string;
    lastName?: string;
}
export default class Auth extends Collection {
    providers: ProvidersInterface;
    constructor(props: AuthProps);
    createUser(user: UserInfo): Promise<any>;
    provider(name: string): ProviderInterface | undefined;
    updateProviderSetting(name: string, settings: any): void;
    getUserByProperty(prop: "email" | "username" | "pid", value: string): Promise<any>;
    getMeta(): {
        providers: ProvidersInterface;
    };
}
export {};
