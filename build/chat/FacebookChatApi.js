"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const LoggingUtils_1 = require("../util/logging/LoggingUtils");
class FacebookChatApi {
    constructor(facebookChatApi, facebookLoginHelper) {
        this.facebookChatApi = facebookChatApi;
        this.facebookLoginHelper = facebookLoginHelper;
        this.facebookChatApiFnToPromisifiedFnMap = new Map();
        this.logger = LoggingUtils_1.default.createLogger(FacebookChatApi.name);
    }
    listen(handler) {
        this.handler = handler;
        //return (this.stopListeningFn = this.facebookChatApi.listen(handler));
        return (this.stopListeningFn = this.facebookChatApi.listenMqtt(handler));
    }
    async sendMessage(threadId, message) {
        return this.wrap(this.facebookChatApi.sendMessage)(message, threadId);
    }
    async changeThreadColor(threadId, color) {
        return this.wrap(this.facebookChatApi.changeThreadColor)(color, threadId);
    }
    async getThreadInfo(threadId) {
        return this.wrap(this.facebookChatApi.getThreadInfo)(threadId);
    }
    async getThreadHistory(threadId, amount, timestamp) {
        return this.wrap(this.facebookChatApi.getThreadHistory)(threadId, amount, timestamp);
    }
    async sendTypingIndicator(threadId) {
        let endFn = (fn) => { fn(); };
        await new Promise((resolve, reject) => {
            endFn = this.facebookChatApi.sendTypingIndicator(threadId, (err) => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
        return this.makeEndTypingIndicatorFunction(endFn);
    }
    makeEndTypingIndicatorFunction(originalEndFn) {
        return () => new Promise((resolve, reject) => {
            originalEndFn((err) => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    }
    async markAsRead(threadId) {
        return this.wrap(this.facebookChatApi.markAsRead)(threadId);
    }
    async getUserInfo(ids) {
        return this.wrap(this.facebookChatApi.getUserInfo)(ids);
    }
    async getUserId(name) {
        return this.wrap(this.facebookChatApi.getUserID)(name);
    }
    getCurrentUserId() {
        return parseInt(this.facebookChatApi.getCurrentUserID());
    }
    async handleMessageRequest(threadId, shouldAccept) {
        return this.wrap(this.facebookChatApi.handleMessageRequest)(threadId, shouldAccept);
    }
    async setMessageReaction(messageId, reaction) {
        return this.wrap(this.facebookChatApi.setMessageReaction)(reaction, messageId);
    }
    async resolvePhotoUrl(photoId) {
        return this.wrap(this.facebookChatApi.resolvePhotoUrl)(photoId);
    }
    wrap(fn) {
        return this.attachReloginErrorHandler(this.cachify(fn));
    }
    /**
     * Handles the "errorSummary=Sorry, something went wrong, errorDescription=Please try closing and re-opening
     * your browser window." error that persists after the bot has been logged in for a long period of time
     */
    attachReloginErrorHandler(fn) {
        const self = this;
        return {
            [fn.name || "fn"]: function () {
                const args = arguments;
                return fn.apply(self, args).catch((err) => {
                    if (err.error == 1357004) {
                        self.logger.warn("Caught error that requires relogin. Recovering...");
                        if (!self.loginPromise) {
                            if (self.stopListeningFn && typeof self.stopListeningFn === "function") {
                                self.stopListeningFn();
                                self.logger.info("Stopped listening on old facebook-chat-api instance");
                            }
                            else {
                                self.logger.error("Could not stop listening on old facebook-chat-api instance. " +
                                    "This may cause messages to be handled more than once");
                            }
                            self.loginPromise = Bluebird.resolve(self.facebookLoginHelper.login());
                            self.loginPromise.then((api) => {
                                self.facebookChatApi = api.facebookChatApi;
                                self.facebookChatApiFnToPromisifiedFnMap.clear();
                                if (self.handler) {
                                    self.listen(self.handler);
                                }
                            });
                        }
                        const promise = self.loginPromise.then(() => fn.apply(self, args));
                        self.loginPromise.finally(() => { self.loginPromise = undefined; });
                        return promise;
                    }
                    throw err;
                });
            }
        }[fn.name || "fn"];
    }
    cachify(fn) {
        let promisifiedFn = this.facebookChatApiFnToPromisifiedFnMap.get(fn);
        if (promisifiedFn === undefined) {
            promisifiedFn = Bluebird.promisify(fn);
            this.facebookChatApiFnToPromisifiedFnMap.set(fn, promisifiedFn);
        }
        return promisifiedFn;
    }
}
exports.FacebookChatApi = FacebookChatApi;
//# sourceMappingURL=FacebookChatApi.js.map