"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YamlApplicationConfiguration_1 = require("./config/YamlApplicationConfiguration");
const Botyo_1 = require("./Botyo");
const FriendlyCommandErrorHandler_1 = require("./modules/FriendlyCommandErrorHandler");
const TypeUtils_1 = require("./util/TypeUtils");
class BotyoBuilder {
    constructor() {
        this.asyncResolvables = [];
        this.modules = [];
        this.moduleConfigs = new Map();
        this.commandErrorHandler = FriendlyCommandErrorHandler_1.default;
        this.applicationConfigurationProvider = () => new YamlApplicationConfiguration_1.default(BotyoBuilder.DEFAULT_CONFIG_FILE);
    }
    configuration(config) {
        if (typeof config === "string") {
            this.applicationConfigurationProvider = () => new YamlApplicationConfiguration_1.default(config);
            return this;
        }
        if (!TypeUtils_1.default.isApplicationConfiguration(config)) {
            throw new Error("Configuration must be the path to the configuration file or an instance of "
                + "ApplicationConfiguration");
        }
        this.applicationConfigurationProvider = () => config;
        return this;
    }
    registerBundle(bundle) {
        if (!TypeUtils_1.default.isBundle(bundle)) {
            throw new Error("Object must conform to the 'Bundle' interface");
        }
        bundle.asyncResolvables.forEach(ar => this.registerAsyncResolvable(ar));
        bundle.modules.forEach(m => this.registerModule(m));
        return this;
    }
    registerAsyncResolvable(clazz) {
        BotyoBuilder.checkClass(clazz, "AsyncResolvable", TypeUtils_1.default.isAsyncResolvable);
        this.asyncResolvables.push(clazz);
        return this;
    }
    registerModule(clazz, config = {}) {
        BotyoBuilder.checkClass(clazz, "Module", TypeUtils_1.default.isModule);
        this.modules.push(clazz);
        this.moduleConfigs.set(clazz, config);
        return this;
    }
    registerCommandErrorHandler(clazz, config = {}) {
        BotyoBuilder.checkClass(clazz, "CommandErrorHandlerModule", TypeUtils_1.default.isCommandErrorHandlerModule);
        this.commandErrorHandler = clazz;
        this.moduleConfigs.set(clazz, config);
        return this;
    }
    build() {
        return new Botyo_1.default(this.applicationConfigurationProvider, this.asyncResolvables, this.modules, this.commandErrorHandler, this.moduleConfigs);
    }
    static checkClass(clazz, requiredInterface, typeGuardFn) {
        const requiredInterfaceName = requiredInterface.name || requiredInterface;
        if (typeof clazz !== "function") {
            throw new Error(`Argument must be a constructor of a ${requiredInterfaceName}`);
        }
        if (!typeGuardFn(clazz.prototype)) {
            throw new Error(`The specified class '${clazz.name}' must conform to the ${requiredInterfaceName} interface`);
        }
    }
}
BotyoBuilder.DEFAULT_CONFIG_FILE = "config.yaml";
exports.default = BotyoBuilder;
//# sourceMappingURL=BotyoBuilder.js.map