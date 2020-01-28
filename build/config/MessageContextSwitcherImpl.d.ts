import { ApplicationConfiguration, Constructor, Message, MessageContextSwitcher, Module, ModuleConfiguration } from "botyo-api";
export default class MessageContextSwitcherImpl implements MessageContextSwitcher {
    private readonly applicationConfiguration;
    private readonly moduleConstructor;
    private readonly msg;
    private threadId;
    private senderId;
    constructor(applicationConfiguration: ApplicationConfiguration, moduleConstructor: Constructor<Module>, msg: Message);
    ofChatThread(): ModuleConfiguration;
    ofParticipant(): ModuleConfiguration;
}
