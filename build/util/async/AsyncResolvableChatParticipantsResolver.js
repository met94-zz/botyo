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
var AsyncResolvableChatParticipantsResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
const botyo_api_1 = require("botyo-api");
const inversify_1 = require("inversify");
const _ = require("lodash");
const util = require("util");
const REGEX_DIGITS = /^\d+$/;
let AsyncResolvableChatParticipantsResolver = AsyncResolvableChatParticipantsResolver_1 = class AsyncResolvableChatParticipantsResolver extends botyo_api_1.AbstractEmptyAsyncResolvable {
    constructor(chatApi, applicationConfiguration, logger, chatThreadUtils) {
        super();
        this.chatApi = chatApi;
        this.applicationConfiguration = applicationConfiguration;
        this.logger = logger;
        this.chatThreadUtils = chatThreadUtils;
        this.vanityNameToUserIdMap = new Map();
    }
    async resolve() {
        await this.resolveDeclaredVanityNamesToIds();
        await this.populateActualParticipants();
        await this.populateParticipantsInfo();
    }
    async resolveDeclaredVanityNamesToIds() {
        const vanityToGetUserIdPromiseMap = new Map();
        return this.chatThreadUtils.forEachParticipantInEachChatThread(async (chatThreadId, participantVanityOrId, participantObj, participantsObj) => {
            // if this looks like id, skip it
            if (REGEX_DIGITS.test(participantVanityOrId)) {
                return;
            }
            let userId = this.vanityNameToUserIdMap.get(participantVanityOrId);
            if (userId === undefined) {
                let getUserIdPromise = vanityToGetUserIdPromiseMap.get(participantVanityOrId);
                if (getUserIdPromise === undefined) {
                    getUserIdPromise = this.chatApi.getUserId(participantVanityOrId);
                    vanityToGetUserIdPromiseMap.set(participantVanityOrId, getUserIdPromise);
                }
                const results = (await getUserIdPromise).filter(r => r.type === "user");
                if (results.length === 0) {
                    this.logger.warn(`Could not find a user with vanity name '${participantVanityOrId}'. ` +
                        `Configuration for this user will not be applied.`);
                    return;
                }
                const theResult = results[0];
                if (results.length > 1) {
                    this.logger.warn(`There are multiple users with vanity names similar to '${participantVanityOrId}'. ` +
                        `Botyo will assume the person you meant is '${theResult.profileUrl}'. ` +
                        `If this is incorrect please use the Facebook ID of the desired person. ` +
                        `Here are the search results for your convenience:\n%s`, util.inspect(_.fromPairs(_.map(results, r => [r.userID, r.profileUrl]))));
                }
                userId = theResult.userID;
                // cache it
                this.vanityNameToUserIdMap.set(participantVanityOrId, userId);
                this.logger.verbose(`${participantVanityOrId} -> ${userId}`);
            }
            // assign the same object to the new id property and keep the vanity property in order for the
            // configuration to stay in sync and for convenience
            participantsObj[userId] = participantsObj[participantVanityOrId];
        });
    }
    async populateActualParticipants() {
        if (!this.applicationConfiguration.hasProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS)) {
            this.applicationConfiguration.setProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS, {});
        }
        const chatThreadsObj = this.applicationConfiguration.getProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS);
        for (let chatThreadId of _.keys(chatThreadsObj)) {
            chatThreadsObj[chatThreadId] = chatThreadsObj[chatThreadId] || {};
            let threadInfo;
            try {
                threadInfo = await this.chatApi.getThreadInfo(chatThreadId);
            }
            catch (err) {
                this.logger.warn(`Could not get info for chat thread '${chatThreadId}'. ` +
                    `Please make sure the current user (https://www.facebook.com/${this.chatApi.getCurrentUserId()}) ` +
                    `is a participant of that chat thread (https://m.me/${chatThreadId}).`, err);
                continue;
            }
            chatThreadsObj[chatThreadId].name = threadInfo.threadName || undefined;
            if (!_.has(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS)) {
                _.set(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS, {});
            }
            const participantsObj = _.get(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS);
            threadInfo.participantIDs.forEach(id => {
                if (participantsObj[id] === undefined) {
                    participantsObj[id] = {};
                }
            });
            if (threadInfo.nicknames) {
                for (let [id, nickname] of _.toPairs(threadInfo.nicknames)) {
                    if (participantsObj[id]) {
                        participantsObj[id].nickname = nickname;
                    }
                }
            }
        }
    }
    async populateParticipantsInfo() {
        const idsSet = new Set();
        await this.chatThreadUtils.forEachParticipantInEachChatThread((chatThreadId, participantVanityOrId) => {
            if (!REGEX_DIGITS.test(participantVanityOrId)) {
                return;
            }
            idsSet.add(participantVanityOrId);
        });
        const userInfoResults = await this.chatApi.getUserInfo(Array.from(idsSet));
        return this.chatThreadUtils.forEachParticipantInEachChatThread((chatThreadId, participantId, participantObj, participantsObj) => {
            if (!REGEX_DIGITS.test(participantId)) {
                return;
            }
            const resultForUser = userInfoResults[participantId];
            if (resultForUser === undefined) {
                this.logger.info(`Could not get info for participant with id '${participantId}'`);
                return;
            }
            if (AsyncResolvableChatParticipantsResolver_1.isAccountInactive(resultForUser)) {
                this.logger.warn(`Account 'https://www.facebook.com/${participantId}' appears to be inactive`);
                delete participantsObj[participantId];
                return;
            }
            participantObj.name = resultForUser.name;
            participantObj.firstName = resultForUser.firstName;
            participantObj.id = participantId;
            participantObj.vanity = resultForUser.vanity;
            this.logger.verbose(`${participantId} -> vanity: '${participantObj.vanity}', name: '${participantObj.name}'`);
            // there are users with no vanity names, don't store these
            if (!_.isEmpty(resultForUser.vanity)) {
                participantsObj[resultForUser.vanity] = participantObj;
            }
        });
    }
    static isAccountInactive(u) {
        // most inactive accounts have this reserved name,
        // but some still have their real name, so additional checks need to be done
        if (u.name === "Facebook User" && u.firstName === "Facebook User")
            return true;
        // gender 7 apparently means account is inactive
        if (u.gender === 7)
            return true;
        // ALL inactive accounts are returned with no vanity AND no profileUrl
        if (!u.vanity && !u.profileUrl)
            return true;
        return false;
    }
};
AsyncResolvableChatParticipantsResolver = AsyncResolvableChatParticipantsResolver_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(botyo_api_1.ChatApi.SYMBOL)),
    __param(1, inversify_1.inject(botyo_api_1.ApplicationConfiguration.SYMBOL)),
    __param(2, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __param(3, inversify_1.inject(botyo_api_1.ChatThreadUtils.SYMBOL)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AsyncResolvableChatParticipantsResolver);
exports.default = AsyncResolvableChatParticipantsResolver;
//# sourceMappingURL=AsyncResolvableChatParticipantsResolver.js.map