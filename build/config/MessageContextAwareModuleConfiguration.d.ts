import { ApplicationConfiguration, Constructor, FacebookId, Module } from "botyo-api";
import { AbstractModuleConfiguration } from "./AbstractModuleConfiguration";
export declare enum ConfigurationContext {
    CHAT_THREAD = 0,
    PARTICIPANT = 1
}
export default class MessageContextAwareModuleConfiguration extends AbstractModuleConfiguration {
    private readonly applicationConfiguration;
    protected readonly moduleConstructor: Constructor<Module>;
    private readonly cfgCtx;
    private readonly threadId;
    private readonly senderId;
    constructor(applicationConfiguration: ApplicationConfiguration, moduleConstructor: Constructor<Module>, cfgCtx: ConfigurationContext, threadId: FacebookId, senderId: FacebookId);
    getProperty(property: string): any;
    hasProperty(property: string): boolean;
    setProperty(property: string, value: any): void;
    getRawObject(): object;
}
