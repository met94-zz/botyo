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
const ModuleRegistry_1 = require("../../util/ioc/ModuleRegistry");
const botyo_api_1 = require("botyo-api");
const Bluebird = require("bluebird");
let FilterChain = class FilterChain {
    constructor(moduleRegistry, logger) {
        this.moduleRegistry = moduleRegistry;
        this.logger = logger;
    }
    async pass(msg) {
        let currentMessage = msg;
        for (let filterModule of this.moduleRegistry.getFilterModules()) {
            const isEnabled = filterModule.getRuntime()
                .getConfiguration().inContext(msg).ofParticipant()
                .isEnabled();
            if (!isEnabled)
                continue;
            try {
                currentMessage = await Bluebird.try(() => filterModule.filter(currentMessage));
            }
            catch (err) {
                this.logger.error("Filter chain broke due to an error", err);
                break;
            }
            if (currentMessage === undefined)
                break;
        }
    }
};
FilterChain = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ModuleRegistry_1.default)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [ModuleRegistry_1.default, Object])
], FilterChain);
exports.default = FilterChain;
//# sourceMappingURL=FilterChain.js.map