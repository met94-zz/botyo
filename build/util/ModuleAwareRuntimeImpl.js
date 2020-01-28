"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleAwareRuntimeImpl {
    constructor(moduleConstructor, chatApi, applicationConfiguration, logger, chatThreadUtils) {
        this.moduleConstructor = moduleConstructor;
        this.chatApi = chatApi;
        this.applicationConfiguration = applicationConfiguration;
        this.logger = logger;
        this.chatThreadUtils = chatThreadUtils;
    }
    getChatApi() {
        return this.chatApi;
    }
    getApplicationConfiguration() {
        return this.applicationConfiguration;
    }
    getConfiguration() {
        return this.getApplicationConfiguration().forModule(this.moduleConstructor);
    }
    getLogger() {
        return this.logger;
    }
    getChatThreadUtils() {
        return this.chatThreadUtils;
    }
}
exports.ModuleAwareRuntimeImpl = ModuleAwareRuntimeImpl;
//# sourceMappingURL=ModuleAwareRuntimeImpl.js.map