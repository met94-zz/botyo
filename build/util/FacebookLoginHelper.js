"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FacebookLoginHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const botyo_api_1 = require("botyo-api");
const fs = require("fs");
const FacebookChatApi_1 = require("../chat/FacebookChatApi");
const storage_blob_1 = require("@azure/storage-blob");
const delay = require("delay");
const LoggingUtils_1 = require("./logging/LoggingUtils");
const fbLogin = require('facebook-chat-api');
let FacebookLoginHelper = FacebookLoginHelper_1 = class FacebookLoginHelper {
    constructor(applicationConfiguration, logger, azureStorage) {
        this.applicationConfiguration = applicationConfiguration;
        this.logger = logger;
        this.azureStorage = azureStorage;
        this.cookiesFilePath = this.getCookiesFilePath();
        this.approvalWaitTime = this.applicationConfiguration.getOrElse(FacebookLoginHelper_1.CONFIG_FACEBOOK_APPROVAL_TIMEOUT, FacebookLoginHelper_1.CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT);
    }
    async getAuthorizationCode() {
        var _a;
        if (this.azureStorage != null) {
            const containerName = this.applicationConfiguration.getProperty(FacebookLoginHelper_1.CONFIG_AZURE_CONTAINER_NAME);
            const secretFileName = this.applicationConfiguration.getProperty(FacebookLoginHelper_1.CONFIG_AZURE_SECRET_FILE_NAME);
            const container = this.azureStorage.getContainerClient(containerName);
            const secret = container.getBlobClient(secretFileName);
            let code;
            if (!(await secret.exists())) {
                this.logger.info("Secret file not found...");
            }
            else {
                code = (_a = (await secret.downloadToBuffer())) === null || _a === void 0 ? void 0 : _a.toString();
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
    tryLogin(doResolve, reject) {
        fbLogin(this.makeLoginOptions(), this.makeOptions(), (err, api) => {
            this.logger.info("Checking response...");
            if (err) {
                this.logger.warn("Login error" + LoggingUtils_1.default.objectDumper(err, null));
                if (err.error === "login-approval") {
                    this.logger.warn(`You need to approve this login from a device you have previously logged in on. ` +
                        `You have ${this.approvalWaitTime}s to do this.`);
                    setTimeout(async () => err.continue(await this.getAuthorizationCode()), this.approvalWaitTime * 1000);
                    return;
                }
                return reject(err);
            }
            this.removePasswordFromConfiguration();
            this.configureApi(api);
            this.persistAppState(api);
            this.logger.info("Logged in successfully");
            return doResolve(new FacebookChatApi_1.FacebookChatApi(api, this));
        });
    }
    async login() {
        return new Promise((doResolve, reject) => {
            this.logger.info("Logging in...");
            this.tryLogin(doResolve, reject);
        });
    }
    removePasswordFromConfiguration() {
        this.applicationConfiguration.setProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_PASSWORD, "");
    }
    persistAppState(api) {
        this.logger.info("Saving Facebook session...");
        fs.writeFileSync(this.cookiesFilePath, JSON.stringify(api.getAppState()));
    }
    configureApi(api) {
        api.setOptions({
            selfListen: this.applicationConfiguration.getOrElse(FacebookLoginHelper_1.CONFIG_FACEBOOK_SELF_LISTEN, FacebookLoginHelper_1.CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT)
        });
    }
    makeLoginOptions() {
        const loginData = {};
        if (this.isAppStateAvailable()) {
            this.logger.info("Logging in using the stored Facebook session...");
            loginData.appState = JSON.parse(fs.readFileSync(this.cookiesFilePath, 'utf-8'));
        }
        else {
            this.logger.info("Logging in with a new session...");
            loginData.email = this.applicationConfiguration
                .getProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_EMAIL);
            loginData.password = this.applicationConfiguration
                .getProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_PASSWORD);
        }
        return loginData;
    }
    makeOptions() {
        const options = {};
        if (this.applicationConfiguration.hasProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_USER_AGENT)) {
            this.logger.info("Using custom user agent");
            options.userAgent = this.applicationConfiguration.getProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_USER_AGENT);
            this.logger.info(options.userAgent);
        }
        if (this.applicationConfiguration.hasProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_FORCE_LOGIN)) {
            options.forceLogin = this.applicationConfiguration.getProperty(FacebookLoginHelper_1.CONFIG_FACEBOOK_FORCE_LOGIN);
            if (options.forceLogin) {
                this.logger.info("Force login enabled");
            }
        }
        return options;
    }
    getCookiesFilePath() {
        return this.applicationConfiguration.getOrElse(FacebookLoginHelper_1.CONFIG_COOKIES_FILE, FacebookLoginHelper_1.CONFIG_COOKIES_FILE_DEFAULT);
    }
    isAppStateAvailable() {
        return fs.existsSync(this.getCookiesFilePath());
    }
};
FacebookLoginHelper.CONFIG_COOKIES_FILE = "facebook.cookiesFile";
FacebookLoginHelper.CONFIG_COOKIES_FILE_DEFAULT = "cookies.json";
FacebookLoginHelper.CONFIG_FACEBOOK_EMAIL = "facebook.email";
FacebookLoginHelper.CONFIG_FACEBOOK_PASSWORD = "facebook.password";
FacebookLoginHelper.CONFIG_FACEBOOK_APPROVAL_TIMEOUT = "facebook.approvalTimeout";
FacebookLoginHelper.CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT = 30;
FacebookLoginHelper.CONFIG_FACEBOOK_USER_AGENT = "facebook.userAgent";
FacebookLoginHelper.CONFIG_FACEBOOK_FORCE_LOGIN = "facebook.forceLogin";
FacebookLoginHelper.CONFIG_AZURE_CONTAINER_NAME = "azure.container";
FacebookLoginHelper.CONFIG_AZURE_SECRET_FILE_NAME = "azure.secret";
FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN = "facebook.selfListen";
FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT = false;
FacebookLoginHelper = FacebookLoginHelper_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(botyo_api_1.ApplicationConfiguration.SYMBOL)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __param(2, inversify_1.inject(botyo_api_1.AzureStorage.SYMBOL)),
    __metadata("design:paramtypes", [Object, Object, storage_blob_1.BlobServiceClient])
], FacebookLoginHelper);
exports.default = FacebookLoginHelper;
//# sourceMappingURL=FacebookLoginHelper.js.map