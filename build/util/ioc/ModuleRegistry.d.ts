import { CommandModule, FilterModule, Logger, Module, ScheduledTaskModule } from "botyo-api";
export default class ModuleRegistry {
    private readonly logger;
    private readonly commandModules;
    private readonly filterModules;
    private readonly scheduledTaskModules;
    constructor(logger: Logger);
    getCommandModules(): CommandModule[];
    getFilterModules(): FilterModule[];
    getScheduledTaskModules(): ScheduledTaskModule[];
    getModules(): Module[];
    register(module: Module): void;
    private registerScheduledTaskModule;
    private registerFilterModule;
    private registerCommandModule;
}
