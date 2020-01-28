import { AbstractFilterModule, CommandErrorHandlerModule, Logger, Message } from "botyo-api";
import CommandManager from "../util/ioc/CommandManager";
export default class CommandExecutorFilter extends AbstractFilterModule {
    private readonly commandManager;
    private readonly errorHandler;
    private readonly logger;
    constructor(commandManager: CommandManager, errorHandler: CommandErrorHandlerModule, logger: Logger);
    filter(msg: Message): Promise<Message | void>;
    private static getArgs;
    private static getCommandNameFromMessage;
    private static shouldProcess;
}
