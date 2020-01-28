import { AbstractCommandModule, Message } from "botyo-api";
import CommandManager from "../util/ioc/CommandManager";
import ModuleRegistry from "../util/ioc/ModuleRegistry";
export default class HelpCommand extends AbstractCommandModule {
    private readonly commandManager;
    private readonly moduleRegistry;
    constructor(commandManager: CommandManager, moduleRegistry: ModuleRegistry);
    getCommand(): string;
    getDescription(): string;
    getUsage(): string;
    validate(msg: Message, argsString: string): boolean;
    execute(msg: Message, argsString: string): Promise<any>;
    private getHelp;
    private getContextPrefix;
    private makeCommandList;
    private static getCommandNameFromString;
}
