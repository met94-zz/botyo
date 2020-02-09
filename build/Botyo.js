"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("source-map-support/register");
const botyo_api_1 = require("botyo-api");
const BotyoBuilder_1 = require("./BotyoBuilder");
const ApplicationContainer_1 = require("./util/ioc/ApplicationContainer");
const _ = require("lodash");
const AsyncResolvableFacebookChatApi_1 = require("./util/async/AsyncResolvableFacebookChatApi");
const AsyncResolvableChatParticipantsResolver_1 = require("./util/async/AsyncResolvableChatParticipantsResolver");
const fs = require("fs");
const ChatThreadFilter_1 = require("./modules/ChatThreadFilter");
const CommandExecutorFilter_1 = require("./modules/CommandExecutorFilter");
const FilterChain_1 = require("./modules/util/FilterChain");
const LoggingUtils_1 = require("./util/logging/LoggingUtils");
const HelpCommand_1 = require("./modules/HelpCommand");
const path = require("path");
const ChatThreadParticipantsUpdaterScheduledTask_1 = require("./modules/ChatThreadParticipantsUpdaterScheduledTask");
const TaskScheduler_1 = require("./modules/util/TaskScheduler");
const ModuleRegistry_1 = require("./util/ioc/ModuleRegistry");
const Bluebird = require("bluebird");
const CommandManager_1 = require("./util/ioc/CommandManager");
const AsyncResolvableAzureStorage_1 = require("./util/async/AsyncResolvableAzureStorage");
class Botyo {
    constructor(applicationConfigurationProvider, asyncResolvables, modules, commandErrorHandler, moduleConfigs) {
        this.applicationConfigurationProvider = applicationConfigurationProvider;
        this.asyncResolvables = asyncResolvables;
        this.modules = modules;
        this.commandErrorHandler = commandErrorHandler;
        this.moduleConfigs = moduleConfigs;
        this.startFinished = false;
        this.running = false;
    }
    async start() {
        if (this.running)
            return;
        this.running = true;
        this.startFinished = false;
        Botyo.printBanner();
        this.logger = LoggingUtils_1.default.createLogger("Botyo", true);
        process.on('unhandledRejection', reason => {
            this.logger.error(String(reason));
            //this.logger.error(LoggingUtils.objectDumper(reason, 0));
        });
        this.applicationContainer = ApplicationContainer_1.default.create();
        this.applicationConfiguration = this.applicationConfigurationProvider.call(this);
        this.applicationContainer.bindApplicationConfiguration(this.applicationConfiguration);
        this.iocContainer = this.applicationContainer.getIoCContainer();
        await this.bindAsyncResolvables();
        this.bindModuleConfigs();
        this.bindModules();
        await this.attachFilterChainMessageListener();
        this.startTaskScheduler();
        this.startFinished = true;
    }
    async stop() {
        if (!this.running)
            return;
        this.running = false;
        this.logger.info("Botyo is shutting down...");
        try {
            await this.invokeFunctionOnAllModules("onShutdown");
        }
        catch (err) {
            this.logger.warn("A non-fatal error occurred while shutting down modules", err);
        }
        if (this.taskScheduler)
            this.taskScheduler.stop();
        if (this.stopListening)
            this.stopListening();
        this.logger.info("Botyo has been shut down");
    }
    async bindAsyncResolvables() {
        await this.applicationContainer.bindAndResolveAsyncResolvable(AsyncResolvableAzureStorage_1.AsyncResolvableAzureStorage);
        await this.applicationContainer.bindAndResolveAsyncResolvable(AsyncResolvableFacebookChatApi_1.default);
        await this.applicationContainer.bindAndResolveAsyncResolvable(AsyncResolvableChatParticipantsResolver_1.default);
        for (let ar of this.asyncResolvables) {
            await this.applicationContainer.bindAndResolveAsyncResolvable(ar);
        }
    }
    bindModuleConfigs() {
        for (let [moduleClass, moduleConfig] of this.moduleConfigs.entries()) {
            _.merge(this.applicationConfiguration.getRawObject(), {
                modules: {
                    [moduleClass.name]: moduleConfig
                }
            });
        }
    }
    bindModules() {
        this.applicationContainer.bindToSelfAndGet(ChatThreadParticipantsUpdaterScheduledTask_1.default);
        this.applicationContainer.bindToSelfAndGet(ChatThreadFilter_1.default);
        this.applicationContainer.bindAndGet(botyo_api_1.CommandErrorHandlerModule.SYMBOL, this.commandErrorHandler);
        this.applicationContainer.bindToSelfAndGet(HelpCommand_1.default);
        for (let moduleClass of this.modules) {
            this.applicationContainer.bindToSelfAndGet(moduleClass);
        }
        this.applicationContainer.bindToSelfAndGet(CommandExecutorFilter_1.default);
        this.iocContainer.get(CommandManager_1.default).populate();
    }
    async attachFilterChainMessageListener() {
        const filterChain = this.iocContainer.get(FilterChain_1.default);
        const chatApi = this.iocContainer.get(botyo_api_1.ChatApi.SYMBOL);
        this.stopListening = chatApi.listen((err, msg) => {
            if (err) {
                this.logger.error(err);
                return;
            }
            filterChain.pass(msg);
        });
        await this.invokeFunctionOnAllModules("onListen");
    }
    async invokeFunctionOnAllModules(fnName) {
        await Bluebird
            .all(this.iocContainer
            .get(ModuleRegistry_1.default)
            .getModules()
            .map(module => module[fnName])
            .map(fn => Bluebird.try(() => fn())))
            .then(() => { });
    }
    startTaskScheduler() {
        this.taskScheduler = this.iocContainer.get(TaskScheduler_1.default);
        this.taskScheduler.start();
    }
    static builder() {
        return new BotyoBuilder_1.default();
    }
    static printBanner() {
        console.log(fs.readFileSync(path.join(__dirname, '..', 'banner.txt'), 'utf-8'));
    }
}
exports.default = Botyo;
//# sourceMappingURL=Botyo.js.map