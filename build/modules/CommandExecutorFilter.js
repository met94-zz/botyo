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
const Bluebird = require("bluebird");
const CommandManager_1 = require("../util/ioc/CommandManager");
let CommandExecutorFilter = class CommandExecutorFilter extends botyo_api_1.AbstractFilterModule {
    constructor(commandManager, errorHandler, logger) {
        super();
        this.commandManager = commandManager;
        this.errorHandler = errorHandler;
        this.logger = logger;
    }
    async filter(msg) {
        const configuration = this.getRuntime().getConfiguration();
        if (!CommandExecutorFilter.shouldProcess(configuration, msg)) {
            return msg;
        }
        const commandName = CommandExecutorFilter.getCommandNameFromMessage(configuration, msg);
        const commandModule = this.commandManager.getCommandToCommandModuleMap(msg).get(commandName);
        if (commandModule === undefined) {
            this.getRuntime().getLogger().info(`Unknown command '${commandName}'`);
            return;
        }
        if (!CommandManager_1.default.isCommandEnabledInContext(commandModule, msg)) {
            this.logger.info(`Command '${commandName}' is disabled in context: chat thread '${msg.threadID}' / participant '${msg.senderID}'`);
            return msg;
        }
        const chatApi = this.getRuntime().getChatApi();
        const args = CommandExecutorFilter.getArgs(msg);
        if (!commandModule.validate(msg, args)) {
            const prefix = CommandManager_1.default.getPrefixOfContext(configuration, msg);
            const helpText = CommandManager_1.default.makeHelpText(prefix, commandName, commandModule);
            return chatApi.sendMessage(msg.threadID, `\u26A0 Incorrect syntax\n\n${helpText}`);
        }
        chatApi.markAsRead(msg.threadID).catch(err => this.logger.warn(err));
        const endFnPromise = chatApi.sendTypingIndicator(msg.threadID);
        return Bluebird
            .try(() => commandModule.execute(msg, args))
            .catch(err => {
            const logger = this.getRuntime().getLogger();
            Bluebird
                .try(() => this.errorHandler.handle(err, msg, commandModule))
                .catch(err => {
                logger.error(`Error in ${this.errorHandler.constructor.name}::handle(...)`, err);
            });
            logger.error(`Command '${commandName}' handled by '${commandModule.constructor.name}' failed`, err);
        })
            .finally(() => endFnPromise.then(endFn => endFn()));
    }
    static getArgs(msg) {
        const prefixedCommand = msg.body.split(/\s+/)[0];
        return msg.body.substring(msg.body.indexOf(prefixedCommand) + prefixedCommand.length).trim();
    }
    static getCommandNameFromMessage(cfg, msg) {
        const prefixedCommand = msg.body.split(/\s+/)[0];
        const prefix = CommandManager_1.default.getPrefixOfContext(cfg, msg);
        return prefixedCommand.substring(prefixedCommand.indexOf(prefix) + prefix.length);
    }
    static shouldProcess(cfg, msg) {
        const isEnabled = cfg
            .inContext(msg)
            .ofParticipant()
            .isEnabled();
        if (!isEnabled)
            return false;
        if (_.isEmpty(msg.body))
            return false;
        const prefixOfContext = CommandManager_1.default.getPrefixOfContext(cfg, msg);
        return msg.body.startsWith(prefixOfContext);
    }
};
CommandExecutorFilter = __decorate([
    __param(0, inversify_1.inject(CommandManager_1.default)),
    __param(1, inversify_1.inject(botyo_api_1.CommandErrorHandlerModule.SYMBOL)),
    __param(2, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [CommandManager_1.default, Object, Object])
], CommandExecutorFilter);
exports.default = CommandExecutorFilter;
//# sourceMappingURL=CommandExecutorFilter.js.map