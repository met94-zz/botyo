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
const botyo_api_1 = require("botyo-api");
const inversify_1 = require("inversify");
const _ = require("lodash");
const stringSimilarity = require("string-similarity");
const SIMILARITY_THRESHOLD = 0.5;
let ChatThreadUtilsImpl = class ChatThreadUtilsImpl {
    constructor(appConfig, logger) {
        this.appConfig = appConfig;
        this.logger = logger;
    }
    getChatThreadIds() {
        return _.keys(this.appConfig.getProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS));
    }
    getNickname(threadId, participantId) {
        return this.appConfig.getOrElse(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}[${threadId}].${botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS}[${participantId}].nickname`, undefined);
    }
    getNicknameByMessage(msg) {
        return this.getNickname(msg.threadID, msg.senderID);
    }
    getName(userId) {
        let name;
        this.forEachParticipantInEachChatThread((threadId, participantVanityOrId, participantObj) => {
            if (participantVanityOrId == userId) {
                name = participantObj.name;
                return false; // breaks the iteration
            }
            return;
        });
        return name;
    }
    getNameByMessage(msg) {
        return this.getName(msg.senderID);
    }
    getFirstName(userId) {
        let firstName;
        this.forEachParticipantInEachChatThread((threadId, participantVanityOrId, participantObj) => {
            if (participantVanityOrId == userId) {
                firstName = participantObj.firstName;
                return false; // breaks the iteration
            }
            return;
        });
        return firstName;
    }
    getFirstNameByMessage(msg) {
        return this.getFirstName(msg.senderID);
    }
    getParticipantIdByAddressee(threadId, addressee) {
        let max = {
            userId: undefined,
            rating: 0,
            match: undefined
        };
        this.forEachParticipantInEachChatThread((currentThreadId, participantId, participantObj) => {
            if (currentThreadId !== threadId)
                return;
            if (!/^\d+$/.test(participantId))
                return;
            function updateMaxIfRatingIsGreater(str) {
                const rating = stringSimilarity.compareTwoStrings(addressee, str);
                if (rating > max.rating) {
                    max.userId = participantId;
                    max.rating = rating;
                    max.match = str;
                }
            }
            if (participantObj.aliases) {
                participantObj.aliases.forEach(a => updateMaxIfRatingIsGreater(a));
            }
            if (participantObj.nickname) {
                updateMaxIfRatingIsGreater(participantObj.nickname);
            }
            updateMaxIfRatingIsGreater(participantObj.firstName);
            updateMaxIfRatingIsGreater(participantObj.name);
            if (participantObj.vanity) {
                updateMaxIfRatingIsGreater(participantObj.vanity);
            }
        });
        if (max.rating >= SIMILARITY_THRESHOLD) {
            this.logger.verbose(`Matched addressee '${addressee}' to '${max.match}' with ${max.rating.toFixed(2)} confidence`);
            return max.userId;
        }
        this.logger.warn(`Could not match addressee '${addressee}' to participant. ` +
            `Closest match was '${max.match}' with ${max.rating.toFixed(2)} confidence ` +
            `(< ${SIMILARITY_THRESHOLD.toFixed(2)})`);
        return undefined;
    }
    forEachParticipantInEachChatThread(consumer) {
        if (!this.appConfig.hasProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS)) {
            this.appConfig.setProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS, {});
        }
        const chatThreadsObj = this.appConfig.getProperty(botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS);
        let promises = [];
        for (let chatThreadId of _.keys(chatThreadsObj)) {
            chatThreadsObj[chatThreadId] = chatThreadsObj[chatThreadId] || {};
            if (!_.has(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS)) {
                _.set(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS, {});
            }
            const participantsObj = _.get(chatThreadsObj[chatThreadId], botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS);
            for (let participantVanityOrId of _.keys(participantsObj)) {
                const consumerResult = consumer(chatThreadId, participantVanityOrId, participantsObj[participantVanityOrId], participantsObj);
                if (consumerResult === false)
                    break;
                if (consumerResult instanceof Promise)
                    promises.push(consumerResult);
            }
        }
        if (promises.length === 0)
            return;
        return Promise.all(promises).then(() => { });
    }
};
ChatThreadUtilsImpl = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(botyo_api_1.ApplicationConfiguration.SYMBOL)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [Object, Object])
], ChatThreadUtilsImpl);
exports.default = ChatThreadUtilsImpl;
//# sourceMappingURL=ChatThreadUtilsImpl.js.map