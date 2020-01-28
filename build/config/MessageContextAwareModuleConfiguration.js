"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botyo_api_1 = require("botyo-api");
const _ = require("lodash");
const LodashConfiguration_1 = require("./LodashConfiguration");
const AbstractModuleConfiguration_1 = require("./AbstractModuleConfiguration");
var ConfigurationContext;
(function (ConfigurationContext) {
    ConfigurationContext[ConfigurationContext["CHAT_THREAD"] = 0] = "CHAT_THREAD";
    ConfigurationContext[ConfigurationContext["PARTICIPANT"] = 1] = "PARTICIPANT";
})(ConfigurationContext = exports.ConfigurationContext || (exports.ConfigurationContext = {}));
class MessageContextAwareModuleConfiguration extends AbstractModuleConfiguration_1.AbstractModuleConfiguration {
    constructor(applicationConfiguration, moduleConstructor, cfgCtx, threadId, senderId) {
        super();
        this.applicationConfiguration = applicationConfiguration;
        this.moduleConstructor = moduleConstructor;
        this.cfgCtx = cfgCtx;
        this.threadId = threadId;
        this.senderId = senderId;
    }
    getProperty(property) {
        return new LodashConfiguration_1.default(this.getRawObject()).getProperty(property);
    }
    hasProperty(property) {
        return new LodashConfiguration_1.default(this.getRawObject()).hasProperty(property);
    }
    setProperty(property, value) {
        const path = this.resolveModulePropertyPath(property);
        if (this.cfgCtx === ConfigurationContext.CHAT_THREAD) {
            this.applicationConfiguration.setProperty(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}.` +
                `'${this.threadId}'.` +
                `${botyo_api_1.Constants.CONFIG_KEY_OVERRIDES}.` +
                `${path}`, value);
            return;
        }
        if (this.cfgCtx === ConfigurationContext.PARTICIPANT) {
            this.applicationConfiguration.setProperty(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}.` +
                `'${this.threadId}'.${botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS}.` +
                `'${this.senderId}'.${botyo_api_1.Constants.CONFIG_KEY_OVERRIDES}.${path}`, value);
            return;
        }
    }
    getRawObject() {
        let result;
        const cfgInCtxOfChatThread = {};
        _.merge(cfgInCtxOfChatThread, this.applicationConfiguration.getRawObject(), this.applicationConfiguration.getOrElse(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}[${this.threadId}].` +
            `${botyo_api_1.Constants.CONFIG_KEY_OVERRIDES}`, {}));
        if (this.cfgCtx === ConfigurationContext.CHAT_THREAD) {
            result = cfgInCtxOfChatThread;
        }
        if (this.cfgCtx === ConfigurationContext.PARTICIPANT) {
            result = _.merge({}, cfgInCtxOfChatThread, this.applicationConfiguration.getOrElse(`${botyo_api_1.Constants.CONFIG_KEY_CHAT_THREADS}[${this.threadId}].` +
                `${botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS}[${this.senderId}].` +
                `${botyo_api_1.Constants.CONFIG_KEY_OVERRIDES}`, {}));
        }
        return _.get(result, this.resolveModulePropertyPath());
    }
}
exports.default = MessageContextAwareModuleConfiguration;
//# sourceMappingURL=MessageContextAwareModuleConfiguration.js.map