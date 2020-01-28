"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageContextAwareModuleConfiguration_1 = require("./MessageContextAwareModuleConfiguration");
class MessageContextSwitcherImpl {
    constructor(applicationConfiguration, moduleConstructor, msg) {
        this.applicationConfiguration = applicationConfiguration;
        this.moduleConstructor = moduleConstructor;
        this.msg = msg;
        this.threadId = msg.threadID;
        this.senderId = msg.senderID;
    }
    ofChatThread() {
        return new MessageContextAwareModuleConfiguration_1.default(this.applicationConfiguration, this.moduleConstructor, MessageContextAwareModuleConfiguration_1.ConfigurationContext.CHAT_THREAD, this.threadId, this.senderId);
    }
    ofParticipant() {
        return new MessageContextAwareModuleConfiguration_1.default(this.applicationConfiguration, this.moduleConstructor, MessageContextAwareModuleConfiguration_1.ConfigurationContext.PARTICIPANT, this.threadId, this.senderId);
    }
}
exports.default = MessageContextSwitcherImpl;
//# sourceMappingURL=MessageContextSwitcherImpl.js.map