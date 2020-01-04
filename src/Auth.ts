import Collection from "./Collection";

interface ProviderInterface {
    clientId: string,
    clientSecret: string,
    callbackURL: string,
    enabled: boolean
}

interface ProvidersInterface {
    [name: string]: ProviderInterface
}

interface AuthProps {
    location: string,
    providers: ProvidersInterface
};

type AuthProvider = "facebook" | "google" | "email";

interface UserInfo {
    id: string,
    provider: AuthProvider,
    photoURL: string,
    email: string,
    username?: string,
    password?: string,
    pid?: string,
    firstName?: string,
    lastName?: string
}

export default class Auth extends Collection {

    providers: ProvidersInterface = {};

    constructor(props: AuthProps) {
        super({
            location: props.location,
            indexes: [{
                property: 'email'
            }, {
                property: 'username'
            }, {
                property: 'pid'
            }]
        });
        this.providers = props.providers || {};
        this.updateProviderSetting = this.updateProviderSetting.bind(this);
    }

    createUser(user: UserInfo): Promise<any> {

        // @ts-ignore
        user.created = new Date();
        return this.insert(user);
    }

    provider(name: string): ProviderInterface | undefined {
        return this.providers[name];
    }

    updateProviderSetting(name: string, settings: any) {
        this.providers[name] = settings;
    }

    getUserByProperty(prop: "email" | "username" | "pid", value: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.q(prop).eq(value).limit(1).get({ values: true })
                .then(request => {
                    resolve(request.docs.length ? request.docs[0] : undefined);
                })
                .catch(reject);
        })
    }

    getMeta() {
        return {
            providers: this.providers
        }
    }
}