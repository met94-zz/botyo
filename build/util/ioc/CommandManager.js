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
var CommandManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const botyo_api_1 = require("botyo-api");
const ModuleRegistry_1 = require("./ModuleRegistry");
const inversify_1 = require("inversify");
let CommandManager = CommandManager_1 = class CommandManager {
    constructor(moduleRegistry, chatThreadUtils) {
        this.moduleRegistry = moduleRegistry;
        this.chatThreadUtils = chatThreadUtils;
        this.threadToNameToModuleMapMap = new Map();
    }
    populate() {
        for (let chatThreadId of this.chatThreadUtils.getChatThreadIds()) {
            const nameToModuleMap = new Map();
            for (let module of this.moduleRegistry.getCommandModules()) {
                const commands = this.getCommands(module, chatThreadId);
                for (let command of commands) {
                    if (!CommandManager_1.isValidCommand(command)) {
                        throw new Error(`Module '${module.constructor.name}' is trying to handle invalid command '${command}' ` +
                            `in chat thread '${chatThreadId}'. ` +
                            `Please check the module source or its overrides in the configuration.`);
                    }
                    const previouslyRegisteredCommandModule = nameToModuleMap.get(command);
                    if (previouslyRegisteredCommandModule !== undefined) {
                        throw new Error(`Module '${module.constructor.name}' is trying to register command '${command}' ` +
                            `that is already registered by '${previouslyRegisteredCommandModule.constructor.name}' ` +
                            `in chat thread '${chatThreadId}'.`);
                    }
                    nameToModuleMap.set(command, module);
                }
            }
            this.threadToNameToModuleMapMap.set(chatThreadId, nameToModuleMap);
        }
    }
    getCommandToCommandModuleMap(msg) {
        return this.threadToNameToModuleMapMap.get(msg.threadID);
    }
    getCommandsByModuleAndChatThreadId(module, chatThreadId) {
        return module.getRuntime()
            .getConfiguration().inContextOfChatThread(chatThreadId)
            .getOrElse(CommandManager_1.CONFIG_KEY_COMMAND, module.getCommand());
    }
    getCommandNameForModuleInContext(module, ctx) {
        const commands = this.getCommandsByModuleAndChatThreadId(module, ctx.threadID);
        if (_.isArray(commands))
            return commands[0];
        return commands;
    }
    getCommands(module, chatThreadId) {
        const commands = this.getCommandsByModuleAndChatThreadId(module, chatThreadId);
        CommandManager_1.validateCommandArray(commands, module);
        if (!_.isArray(commands)) {
            return [commands];
        }
        return commands;
    }
    static isValidCommand(command) {
        if (!command)
            return false;
        if (!_.isString(command))
            return false;
        if (command.length === 0)
            return false;
        if (command.includes(' '))
            return false;
        return true;
    }
    static validateCommandArray(commands, module) {
        if (!_.isString(commands) && !_.isArray(commands)) {
            throw new Error(`${module.constructor.name}::${module.getCommand.name}() or its override in configuration ` +
                `must be a string or an array of strings`);
        }
        if (_.isArray(commands) && commands.length === 0) {
            throw new Error(`${module.constructor.name}::${module.getCommand.name}() or its override in configuration ` +
                `must not be an empty array`);
        }
    }
    static getPrefixOfContext(cfg, ctx) {
        return cfg
            .inContext(ctx)
            .ofChatThread()
            .getOrElse(this.CONFIG_KEY_PREFIX, this.DEFAULT_PREFIX);
    }
    static makeHelpText(prefix, commandName, commandModule) {
        return `\u2139 ${prefix}${commandName} - ${commandModule.getDescription()}\n` +
            `\u{1F527} Usage: ${prefix}${commandName} ${commandModule.getUsage()}`;
    }
    static isCommandHiddenInContext(commandModule, ctx) {
        return commandModule.getRuntime()
            .getConfiguration()
            .inContext(ctx)
            .ofParticipant()
            .getOrElse(botyo_api_1.Constants.CONFIG_KEY_HIDDEN, false);
    }
    static isCommandEnabledInContext(commandModule, msg) {
        return commandModule.getRuntime()
            .getConfiguration()
            .inContext(msg)
            .ofParticipant()
            .isEnabled();
    }
};
CommandManager.CONFIG_KEY_COMMAND = "command";
CommandManager.CONFIG_KEY_PREFIX = "prefix";
CommandManager.DEFAULT_PREFIX = "#";
CommandManager = CommandManager_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ModuleRegistry_1.default)),
    __param(1, inversify_1.inject(botyo_api_1.ChatThreadUtils.SYMBOL)),
    __metadata("design:paramtypes", [ModuleRegistry_1.default, Object])
], CommandManager);
exports.default = CommandManager;
//# sourceMappingURL=CommandManager.js.map