"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const botyo_api_1 = require("botyo-api");
const LoggingUtils_1 = require("../logging/LoggingUtils");
const _ = require("lodash");
const ModuleRegistry_1 = require("./ModuleRegistry");
const ChatThreadUtilsImpl_1 = require("../ChatThreadUtilsImpl");
const FilterChain_1 = require("../../modules/util/FilterChain");
const TaskScheduler_1 = require("../../modules/util/TaskScheduler");
const TypeUtils_1 = require("../TypeUtils");
const ModuleAwareRuntimeImpl_1 = require("../ModuleAwareRuntimeImpl");
const CommandManager_1 = require("./CommandManager");
const METADATA_KEYS = require("inversify/lib/constants/metadata_keys");
class ApplicationContainer {
    constructor(container) {
        this.container = container;
    }
    static create() {
        const container = new inversify_1.Container({ autoBindInjectable: true });
        const applicationContainer = new ApplicationContainer(container);
        applicationContainer.bindInternals();
        applicationContainer.bindLogger();
        return applicationContainer;
    }
    bindApplicationConfiguration(ac) {
        this.container.bind(botyo_api_1.ApplicationConfiguration.SYMBOL).toConstantValue(ac);
    }
    bindToSelfAndGet(moduleClass) {
        return this.bindAndGet(moduleClass, moduleClass);
    }
    bindAndGet(serviceIdentifier, moduleClass) {
        this.decorateRoot(moduleClass, botyo_api_1.AbstractModule);
        moduleClass.prototype.runtime = this.createModuleAwareRuntime(moduleClass);
        this.container.bind(serviceIdentifier).to(moduleClass).inSingletonScope();
        const module = this.container.get(serviceIdentifier);
        this.container.get(ModuleRegistry_1.default).register(module);
        return module;
    }
    async bindAndResolveAsyncResolvable(arClass) {
        this.decorateRoot(arClass);
        this.container.bind(arClass).toSelf().inSingletonScope();
        const resolvable = this.container.get(arClass);
        const result = await resolvable.resolve();
        if (result === undefined ||
            resolvable.getServiceIdentifier() === botyo_api_1.AbstractEmptyAsyncResolvable.EMPTY_IDENTIFIER ||
            TypeUtils_1.default.likeInstanceOf(resolvable, botyo_api_1.AbstractEmptyAsyncResolvable)) {
            return;
        }
        this.container.bind(resolvable.getServiceIdentifier()).toConstantValue(result);
    }
    getIoCContainer() {
        return this.container;
    }
    createModuleAwareRuntime(moduleClass) {
        return new ModuleAwareRuntimeImpl_1.ModuleAwareRuntimeImpl(moduleClass, this.container.get(botyo_api_1.ChatApi.SYMBOL), this.container.get(botyo_api_1.ApplicationConfiguration.SYMBOL), this.container.getTagged(botyo_api_1.Logger.SYMBOL, LoggingUtils_1.LOGGER_NAME, moduleClass.name), this.container.get(botyo_api_1.ChatThreadUtils.SYMBOL));
    }
    decorateRoot(clazz, root) {
        const protoChain = TypeUtils_1.default.getPrototypeChain(clazz);
        let rootOfClazz = root ? protoChain.find(c => c.name === root.name) : undefined;
        if (!rootOfClazz) {
            const idx = protoChain.map(c => c.name).lastIndexOf("");
            rootOfClazz = protoChain[idx - 1];
        }
        if (rootOfClazz === undefined) {
            throw new Error("Illegal state: Root of class not found");
        }
        if (!Reflect.hasOwnMetadata(METADATA_KEYS.PARAM_TYPES, rootOfClazz)) {
            inversify_1.decorate(inversify_1.injectable(), rootOfClazz);
        }
    }
    bindInternals() {
        this.container.bind(FilterChain_1.default).toSelf().inSingletonScope();
        this.container.bind(CommandManager_1.default).toSelf().inSingletonScope();
        this.container.bind(TaskScheduler_1.default).toSelf().inSingletonScope();
        this.container.bind(ModuleRegistry_1.default).toSelf().inSingletonScope();
        this.container.bind(botyo_api_1.ChatThreadUtils.SYMBOL).to(ChatThreadUtilsImpl_1.default).inSingletonScope();
    }
    bindLogger() {
        this.container.bind(botyo_api_1.Logger.SYMBOL).toDynamicValue(ctx => {
            let loggerName;
            const tags = ctx.plan.rootRequest.target.getCustomTags();
            if (tags !== null) {
                const loggerNameTag = tags.find(tag => tag.key === LoggingUtils_1.LOGGER_NAME);
                if (loggerNameTag !== undefined)
                    loggerName = loggerNameTag.value;
            }
            // try to guess it from target when injected
            if (loggerName === undefined) {
                const target = ctx.plan.rootRequest.target;
                loggerName = _.get(target, "serviceIdentifier.name") ||
                    _.get(target, "serviceIdentifier.prototype.name");
            }
            return LoggingUtils_1.default.createLogger(loggerName);
        });
    }
}
exports.default = ApplicationContainer;
//# sourceMappingURL=ApplicationContainer.js.map