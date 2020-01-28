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
const CommandExecutorFilter_1 = require("./CommandExecutorFilter");
const CommandManager_1 = require("../util/ioc/CommandManager");
const ModuleRegistry_1 = require("../util/ioc/ModuleRegistry");
let HelpCommand = class HelpCommand extends botyo_api_1.AbstractCommandModule {
    constructor(commandManager, moduleRegistry) {
        super();
        this.commandManager = commandManager;
        this.moduleRegistry = moduleRegistry;
    }
    getCommand() {
        return "help";
    }
    getDescription() {
        return "Responds with information how to use the available commands";
    }
    getUsage() {
        return "[ command ]";
    }
    validate(msg, argsString) {
        return true;
    }
    async execute(msg, argsString) {
        const prefix = this.getContextPrefix(msg);
        if (argsString.length === 0) {
            return this.getRuntime()
                .getChatApi()
                .sendMessage(msg.threadID, this.makeCommandList(msg, prefix));
        }
        let args = argsString;
        if (!args.startsWith(prefix)) {
            args = prefix + args;
        }
        return this.getHelp(msg, prefix, args);
    }
    getHelp(msg, prefix, args) {
        const commandName = HelpCommand.getCommandNameFromString(prefix, args);
        const commandModule = this.commandManager.getCommandToCommandModuleMap(msg).get(commandName);
        if (commandModule === undefined) {
            return this.getRuntime().getChatApi().sendMessage(msg.threadID, `\u26A0 Unknown command: ${prefix}${commandName}`);
        }
        const helpText = CommandManager_1.default.makeHelpText(prefix, commandName, commandModule);
        return this.getRuntime().getChatApi().sendMessage(msg.threadID, helpText);
    }
    getContextPrefix(ctx) {
        return CommandManager_1.default.getPrefixOfContext(this.getRuntime().getApplicationConfiguration().forModule(CommandExecutorFilter_1.default), ctx);
    }
    makeCommandList(ctx, prefix) {
        let str = "\u{1F527} Command list:\n\n";
        for (let module of this.moduleRegistry.getCommandModules()) {
            if (CommandManager_1.default.isCommandHiddenInContext(module, ctx) ||
                !CommandManager_1.default.isCommandEnabledInContext(module, ctx)) {
                continue;
            }
            const commandName = this.commandManager.getCommandNameForModuleInContext(module, ctx);
            str += `${prefix}${commandName} - ${module.getDescription()}\n`;
        }
        return str;
    }
    static getCommandNameFromString(prefix, str) {
        const prefixedCommand = str.split(/\s+/)[0];
        return prefixedCommand.substring(prefixedCommand.indexOf(prefix) + prefix.length);
    }
};
HelpCommand = __decorate([
    __param(0, inversify_1.inject(CommandManager_1.default)),
    __param(1, inversify_1.inject(ModuleRegistry_1.default)),
    __metadata("design:paramtypes", [CommandManager_1.default,
        ModuleRegistry_1.default])
], HelpCommand);
exports.default = HelpCommand;
//# sourceMappingURL=HelpCommand.js.map