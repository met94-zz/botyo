import { ApplicationConfiguration, ChatApi, Logger } from "botyo-api";
export default class FacebookLoginHelper {
    private readonly applicationConfiguration;
    private readonly logger;
    private readonly cookiesFilePath;
    constructor(applicationConfiguration: ApplicationConfiguration, logger: Logger);
    login(): Promise<ChatApi>;
    private removePasswordFromConfiguration;
    private persistAppState;
    private configureApi;
    private makeLoginOptions;
    private getCookiesFilePath;
    private isAppStateAvailable;
    static readonly CONFIG_COOKIES_FILE: string;
    static readonly CONFIG_COOKIES_FILE_DEFAULT: string;
    static readonly CONFIG_FACEBOOK_EMAIL: string;
    static readonly CONFIG_FACEBOOK_PASSWORD: string;
    static readonly CONFIG_FACEBOOK_APPROVAL_TIMEOUT: string;
    static readonly CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT: number;
    static readonly CONFIG_FACEBOOK_SELF_LISTEN: string;
    static readonly CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT: boolean;
}
