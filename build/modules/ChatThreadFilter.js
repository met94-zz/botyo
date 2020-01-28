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
let ChatThreadFilter = class ChatThreadFilter extends botyo_api_1.AbstractFilterModule {
    constructor(applicationConfiguration, logger) {
        super();
        this.applicationConfiguration = applicationConfiguration;
        this.logger = logger;
    }
    async filter(msg) {
        const threadID = msg.threadID;
        const shouldListen = this.applicationConfiguration.hasProperty(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}[${threadID}]`);
        if (!shouldListen) {
            this.logger.info(`Received a message from a chat thread (https://m.me/${threadID}) we are not listening to`);
            return;
        }
        return msg;
    }
};
ChatThreadFilter = __decorate([
    __param(0, inversify_1.inject(botyo_api_1.ApplicationConfiguration.SYMBOL)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [Object, Object])
], ChatThreadFilter);
exports.default = ChatThreadFilter;
//# sourceMappingURL=ChatThreadFilter.js.map