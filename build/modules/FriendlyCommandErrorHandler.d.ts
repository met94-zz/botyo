import { AbstractCommandErrorHandlerModule, CommandModule, Message } from "botyo-api";
export default class FriendlyCommandErrorHandler extends AbstractCommandErrorHandlerModule {
    handle(err: Error, message: Message, commandModule: CommandModule): Promise<any>;
}
