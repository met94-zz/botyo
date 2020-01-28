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
const Scheduler = require("node-schedule");
const Bluebird = require("bluebird");
let TaskScheduler = class TaskScheduler {
    constructor(registry, logger) {
        this.registry = registry;
        this.logger = logger;
        this.taskToIntervalMap = new Map();
        this.taskToCronJobMap = new Map();
        this.taskToExecutePromiseMap = new Map();
        this.myBluebird = Bluebird.getNewLibraryCopy();
        this.myBluebird.config({ cancellation: true });
    }
    start() {
        for (let module of this.registry.getScheduledTaskModules()) {
            const taskName = module.constructor.name;
            const isEnabled = module.getRuntime().getConfiguration().isEnabled();
            if (!isEnabled) {
                this.logger.warn(`Scheduled task '${taskName}' is disabled`);
                continue;
            }
            const schedule = module.getSchedule();
            if (typeof schedule === "string") {
                const job = Scheduler.scheduleJob(schedule, () => this.runTask(module));
                this.taskToCronJobMap.set(module, job);
                this.logger.info(`Scheduled task '${taskName}' is scheduled to run according to cron '${schedule}'`);
            }
            else if (typeof schedule === "number") {
                const interval = setInterval(() => this.runTask(module), schedule);
                this.taskToIntervalMap.set(module, interval);
                this.logger.info(`Scheduled task '${taskName}' is scheduled to run every ${schedule} milliseconds`);
            }
            else {
                this.logger.warn(`Scheduled task '${taskName}' will not be scheduled to run ` +
                    `because its schedule is set to '${schedule}'`);
            }
            if (module.shouldExecuteOnStart()) {
                setTimeout(() => this.runTask(module), 0);
            }
        }
    }
    stop() {
        this.taskToIntervalMap.forEach(timer => clearInterval(timer));
        this.taskToIntervalMap.clear();
        this.taskToCronJobMap.forEach(job => job.cancel());
        this.taskToCronJobMap.clear();
        this.taskToExecutePromiseMap.forEach(promise => promise.cancel());
        this.taskToExecutePromiseMap.clear();
        this.logger.info("Task scheduler has been stopped");
    }
    async runTask(module) {
        const taskName = module.constructor.name;
        if (this.taskToExecutePromiseMap.get(module) !== undefined) {
            this.logger.warn(`New run of scheduled task '${taskName}' has been cancelled ` +
                "because the task is still running. The task will attempt to run next time according to schedule. " +
                "Please consider increasing the interval since the task appears to be running longer than expected.");
            return;
        }
        const executePromise = this.myBluebird.try(() => module.execute());
        this.taskToExecutePromiseMap.set(module, executePromise);
        this.logger.info(`Scheduled task '${taskName}' started`);
        return executePromise
            .then(() => {
            this.logger.info(`Scheduled task '${taskName}' finished`);
        })
            .catch(err => {
            this.logger.error(`Scheduled task '${taskName}' failed`, err);
        })
            .finally(() => {
            this.taskToExecutePromiseMap.delete(module);
        });
    }
};
TaskScheduler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ModuleRegistry_1.default)),
    __param(1, inversify_1.inject(botyo_api_1.Logger.SYMBOL)),
    __metadata("design:paramtypes", [ModuleRegistry_1.default, Object])
], TaskScheduler);
exports.default = TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map