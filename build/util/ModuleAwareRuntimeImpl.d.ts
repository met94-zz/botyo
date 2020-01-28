import { ApplicationConfiguration, ChatApi, ChatThreadUtils, Constructor, ContextualizableModuleConfiguration, Logger, Module, ModuleAwareRuntime } from "botyo-api";
export declare class ModuleAwareRuntimeImpl implements ModuleAwareRuntime {
    private readonly moduleConstructor;
    private readonly chatApi;
    private readonly applicationConfiguration;
    private readonly logger;
    private readonly chatThreadUtils;
    constructor(moduleConstructor: Constructor<Module>, chatApi: ChatApi, applicationConfiguration: ApplicationConfiguration, logger: Logger, chatThreadUtils: ChatThreadUtils);
    getChatApi(): ChatApi;
    getApplicationConfiguration(): ApplicationConfiguration;
    getConfiguration(): ContextualizableModuleConfiguration;
    getLogger(): Logger;
    getChatThreadUtils(): ChatThreadUtils;
}
