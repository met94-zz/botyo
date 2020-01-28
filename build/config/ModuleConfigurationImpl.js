"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageContextSwitcherImpl_1 = require("./MessageContextSwitcherImpl");
const AbstractModuleConfiguration_1 = require("./AbstractModuleConfiguration");
class ModuleConfigurationImpl extends AbstractModuleConfiguration_1.AbstractModuleConfiguration {
    constructor(applicationConfiguration, moduleConstructor) {
        super();
        this.applicationConfiguration = applicationConfiguration;
        this.moduleConstructor = moduleConstructor;
    }
    getProperty(property) {
        return this.applicationConfiguration.getProperty(this.resolveModulePropertyPath(property));
    }
    hasProperty(property) {
        return this.applicationConfiguration.hasProperty(this.resolveModulePropertyPath(property));
    }
    setProperty(property, value) {
        return this.applicationConfiguration.setProperty(this.resolveModulePropertyPath(property), value);
    }
    inContext(messageContext) {
        return new MessageContextSwitcherImpl_1.default(this.applicationConfiguration, this.moduleConstructor, messageContext);
    }
    inContextOfChatThread(chatThreadId) {
        return this.inContext({ threadID: chatThreadId }).ofChatThread();
    }
    getRawObject() {
        return this.applicationConfiguration.getProperty(this.resolveModulePropertyPath());
    }
}
exports.default = ModuleConfigurationImpl;
//# sourceMappingURL=ModuleConfigurationImpl.js.map