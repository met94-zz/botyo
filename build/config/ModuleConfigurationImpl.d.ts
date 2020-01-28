import { ApplicationConfiguration, Constructor, ContextualizableModuleConfiguration, FacebookId, Message, MessageContextSwitcher, Module, ModuleConfiguration } from "botyo-api";
import { AbstractModuleConfiguration } from "./AbstractModuleConfiguration";
export default class ModuleConfigurationImpl extends AbstractModuleConfiguration implements ContextualizableModuleConfiguration {
    private readonly applicationConfiguration;
    protected readonly moduleConstructor: Constructor<Module>;
    constructor(applicationConfiguration: ApplicationConfiguration, moduleConstructor: Constructor<Module>);
    getProperty(property: string): any;
    hasProperty(property: string): boolean;
    setProperty(property: string, value: any): void;
    inContext(messageContext: Message): MessageContextSwitcher;
    inContextOfChatThread(chatThreadId: FacebookId): ModuleConfiguration;
    getRawObject(): object;
}
