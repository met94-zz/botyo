"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const botyo_api_1 = require("botyo-api");
const TypeUtils_1 = require("../TypeUtils");
let ModuleRegistry = class ModuleRegistry {
    constructor(logger) {
        this.logger = logger;
        this.commandModules = [];
        this.filterModules = [];
        this.scheduledTaskModules = [];
    }
    getCommandModules() {
        return this.commandModules;
    }
    getFilterModules() {
        return this.filterModules;
    }
    getScheduledTaskModules() {
        return this.scheduledTaskModules;
    }
    getModules() {
        return []
            .concat(this.commandModules)
            .concat(this.filterModules)
            .concat(this.scheduledTaskModules);
    }
    register(module) {
        if (!TypeUtils_1.default.isModule(module)) {
            throw new Error("This is not a module");
        }
        if (TypeUtils_1.default.isCommandModule(module)) {
            return this.registerCommandModule(module);
        }
        if (TypeUtils_1.default.isFilterModule(module)) {
            return this.registerFilterModule(module);
        }
        if (TypeUtils_1.default.isScheduledTaskModule(module)) {
            return this.registerScheduledTaskModule(module);
        }
    }
    registerScheduledTaskModule(module) {
        this.scheduledTaskModules.push(module);
        this.logger.info(`Registered scheduled task module '${module.constructor.name}'`);
    }
    registerFilterModule(module) {
        this.filterModules.push(module);
        this.logger.info(`Registered filter module '${module.constructor.name}'`);
    }
    registerCommandModule(module) {
        this.commandModules.push(module);
        this.logger.info(`Registered command module '${module.constructor.name}'`);
    }
};
ModuleRegistry = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [Object])
], ModuleRegistry);
exports.default = ModuleRegistry;
//# sourceMappingURL=ModuleRegistry.js.map