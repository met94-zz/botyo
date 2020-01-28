import { ChatThreadUtils, CommandModule, ContextualizableModuleConfiguration, FacebookId, Message } from "botyo-api";
import ModuleRegistry from "./ModuleRegistry";
export declare type NameToCommandMap = Map<string, CommandModule>;
export default class CommandManager {
    private readonly moduleRegistry;
    private readonly chatThreadUtils;
    private readonly threadToNameToModuleMapMap;
    constructor(moduleRegistry: ModuleRegistry, chatThreadUtils: ChatThreadUtils);
    populate(): void;
    getCommandToCommandModuleMap(msg: Message): NameToCommandMap;
    getCommandsByModuleAndChatThreadId(module: CommandModule, chatThreadId: FacebookId): string | string[];
    getCommandNameForModuleInContext(module: CommandModule, ctx: Message): string;
    private getCommands;
    private static isValidCommand;
    private static validateCommandArray;
    static getPrefixOfContext(cfg: ContextualizableModuleConfiguration, ctx: Message): any;
    static makeHelpText(prefix: string, commandName: string, commandModule: CommandModule): string;
    static isCommandHiddenInContext(commandModule: CommandModule, ctx: Message): boolean;
    static isCommandEnabledInContext(commandModule: CommandModule, msg: Message): boolean;
    static readonly CONFIG_KEY_COMMAND: string;
    static readonly CONFIG_KEY_PREFIX: string;
    static readonly DEFAULT_PREFIX: string;
}
