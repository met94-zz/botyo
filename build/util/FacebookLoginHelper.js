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
Object.defineProperty(exports, "__esModule", { value: true });
var FacebookLoginHelper_1;
const inversify_1 = require("inversify");
const botyo_api_1 = require("botyo-api");
const fs = require("fs");
const FacebookChatApi_1 = require("../chat/FacebookChatApi");
const fbLogin = require('facebook-chat-api');
let FacebookLoginHelper = FacebookLoginHelper_1 = class FacebookLoginHelper {
    constructor(applicationConfiguration, logger) {
        this.applicationConfiguration = applicationConfiguration;
        this.logger = logger;
        this.cookiesFilePath = this.getCookiesFilePath();
    }
    async login() {
        const self = this;
        return new Promise((doResolve, reject) => {
            this.logger.info("Logging in...");
            fbLogin(this.makeLoginOptions(), { logLevel: "silent" }, (err, api) => {
                if (err) {
                    if (err.error === "login-approval") {
                        const waitTime = this.applicationConfiguration.getOrElse(FacebookLoginHelper_1.CONFIG_FACEBOOK_APPROVAL_TIMEOUT, FacebookLoginHelper_1.CONFIG_FACEBOOK_APPROVAL_TIMEOUT_DEFAULT);
                        this.logger.warn(`You need to approve this login from a device you have previously logged in on. ` +
                            `You have ${waitTime}s to do this.`);
                        setTimeout(() => err.continue(), waitTime * 1000);
                        return;
                    }
                    return reject(err);
                }
                this.removePasswordFromConfiguration();
                this.configureApi(api);
                this.persistAppState(api);
                this.logger.info("Logged in successfully");
                return doResolve(new FacebookChatApi_1.FacebookChatApi(api, self));
            });
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
FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN = "facebook.selfListen";
FacebookLoginHelper.CONFIG_FACEBOOK_SELF_LISTEN_DEFAULT = false;
FacebookLoginHelper = FacebookLoginHelper_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(botyo_api_1.ApplicationConfiguration.SYMBOL)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [Object, Object])
], FacebookLoginHelper);
exports.default = FacebookLoginHelper;
//# sourceMappingURL=FacebookLoginHelper.js.map