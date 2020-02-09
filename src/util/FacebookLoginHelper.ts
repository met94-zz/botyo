import { inject, injectable } from "inversify";
import { ApplicationConfiguration, ChatApi, Logger, AzureStorage } from "botyo-api";
import * as fs from "fs";
import { FacebookChatApi } from "../chat/FacebookChatApi";
import { BlobServiceClient, ContainerClient, BlobClient } from "@azure/storage-blob";
import * as delay from "delay";
import LoggingUtils from "./logging/LoggingUtils";

const fbLogin = require('facebook-chat-api');

@injectable()
export default class FacebookLoginHelper
{
    private readonly cookiesFilePath: string;
    private readonly approvalWaitTime: number;

    constructor(@inject(ApplicationConfiguration.SYMBOL) private readonly applicationConfiguration: ApplicationConfiguration,
        @inject(Logger.SYMBOL) private readonly logger: Logger,
        @inject(AzureStorage.SYMBOL) private readonly azureStorage: BlobServiceClient)
    {
        this.cookiesFilePath = this.getCookiesFilePath();
        this.approvalWaitTime = this.applicationConfiguration.getOrElse(
            FacebookLoginHelper.CONFIG_FACEBOOK_APPROVAL_TIMEOUT,
            FacebookLoginHelper.CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT
        );
    }

    async getAuthorizationCode(): Promise<string | null> {
        if (this.azureStorage != null) {
            const containerName: string = this.applicationConfiguration.getProperty<string>(FacebookLoginHelper.CONFIG_AZURE_CONTAINER_NAME);
            const secretFileName: string = this.applicationConfiguration.getProperty<string>(FacebookLoginHelper.CONFIG_AZURE_SECRET_FILE_NAME);
            const container: ContainerClient = this.azureStorage.getContainerClient(containerName);
            const secret: BlobClient = container.getBlobClient(secretFileName);
            let code;
            if (!(await secret.exists())) {
                this.logger.info("Secret file not found...");
            }
            else {
                code = (await secret.downloadToBuffer())?.toString();
            }
            if (!code) {
                this.logger.info("Awaiting secret code...");
                await delay(5 * 1000);
                return await this.getAuthorizationCode();
            }
            this.logger.info("Continuing with secret " + code);
            return code;
        }
        return null;
    }

    private tryLogin(doResolve: any, reject: any) {
        fbLogin(this.makeLoginOptions(), this.makeOptions(), (err: any, api: any) => {
            this.logger.info("Checking response...");
            if (err) {
                this.logger.warn("Login error" + LoggingUtils.objectDumper(err, null));
                if (err.error === "login-approval") {
                    this.logger.warn(
                        `You need to approve this login from a device you have previously logged in on. ` +
                        `You have ${this.approvalWaitTime}s to do this.`
                    );
                    setTimeout(async () => err.continue(await this.getAuthorizationCode()), this.approvalWaitTime * 1000);
                    return;
                }

                return reject(err);
            }

            this.removePasswordFromConfiguration();
            this.configureApi(api);
            this.persistAppState(api);

            this.logger.info("Logged in successfully");

            return doResolve(new FacebookChatApi(api, this));
        });
    }

    async login(): Promise<ChatApi>
    {
        return new Promise<ChatApi>((doResolve, reject) => {
            this.logger.info("Logging in...");
            this.tryLogin(doResolve, reject);
        });

    }

    private removePasswordFromConfiguration()
    {
        this.applicationConfiguration.setProperty(FacebookLoginHelper.CONFIG_FACEBOOK_PASSWORD, "");
    }

    private persistAppState(api: any)
    {
        this.logger.info("Saving Facebook session...");
        fs.writeFileSync(this.cookiesFilePath, JSON.stringify(api.getAppState()));
    }

    private configureApi(api: any)
    {
        api.setOptions({
            selfListen: this.applicationConfiguration.getOrElse(
                FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN,
                FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT
            )
        });
    }

    private makeLoginOptions(): object
    {
        const loginData: any = {};

        if (this.isAppStateAvailable()) {
            this.logger.info("Logging in using the stored Facebook session...");
            loginData.appState = JSON.parse(fs.readFileSync(this.cookiesFilePath, 'utf-8'));
        } else {
            this.logger.info("Logging in with a new session...");

            loginData.email = this.applicationConfiguration
                .getProperty(FacebookLoginHelper.CONFIG_FACEBOOK_EMAIL);

            loginData.password = this.applicationConfiguration
                .getProperty(FacebookLoginHelper.CONFIG_FACEBOOK_PASSWORD);
        }

        return loginData;
    }

    private makeOptions(): object
    {
        const options: any = {};

        if (this.applicationConfiguration.hasProperty(FacebookLoginHelper.CONFIG_FACEBOOK_USER_AGENT)) {
            this.logger.info("Using custom user agent");
            options.userAgent = this.applicationConfiguration.getProperty<string>(FacebookLoginHelper.CONFIG_FACEBOOK_USER_AGENT);
            this.logger.info(options.userAgent);
        }
        if (this.applicationConfiguration.hasProperty(FacebookLoginHelper.CONFIG_FACEBOOK_FORCE_LOGIN)) {
            options.forceLogin = this.applicationConfiguration.getProperty<boolean>(FacebookLoginHelper.CONFIG_FACEBOOK_FORCE_LOGIN);
            if (options.forceLogin) {
                this.logger.info("Force login enabled");
            }
        }

        return options;
    }

    private getCookiesFilePath(): string
    {
        return this.applicationConfiguration.getOrElse(
            FacebookLoginHelper.CONFIG_COOKIES_FILE,
            FacebookLoginHelper.CONFIG_COOKIES_FILE_DEFAULT
        );
    }

    private isAppStateAvailable(): boolean
    {
        return fs.existsSync(this.getCookiesFilePath());
    }

    static readonly CONFIG_COOKIES_FILE = "facebook.cookiesFile";
    static readonly CONFIG_COOKIES_FILE_DEFAULT = "cookies.json";

    static readonly CONFIG_FACEBOOK_EMAIL = "facebook.email";
    static readonly CONFIG_FACEBOOK_PASSWORD = "facebook.password";

    static readonly CONFIG_FACEBOOK_APPROVAL_TIMEOUT = "facebook.approvalTimeout";
    static readonly CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT = 30;
	
    static readonly CONFIG_FACEBOOK_USER_AGENT = "facebook.userAgent";

    static readonly CONFIG_FACEBOOK_FORCE_LOGIN = "facebook.forceLogin";

    static readonly CONFIG_AZURE_CONTAINER_NAME = "azure.container";
    static readonly CONFIG_AZURE_SECRET_FILE_NAME = "azure.secret";

    static readonly CONFIG_FACEBOOK_SELF_LISTEN = "facebook.selfListen";
    static readonly CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT = false;
}