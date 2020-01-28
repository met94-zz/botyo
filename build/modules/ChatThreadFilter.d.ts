import { AbstractFilterModule, ApplicationConfiguration, Logger, Message } from "botyo-api";
export default class ChatThreadFilter extends AbstractFilterModule {
    private readonly applicationConfiguration;
    private readonly logger;
    constructor(applicationConfiguration: ApplicationConfiguration, logger: Logger);
    filter(msg: Message): Promise<Message | void>;
}
