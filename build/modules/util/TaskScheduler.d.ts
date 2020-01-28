import ModuleRegistry from "../../util/ioc/ModuleRegistry";
import { Logger } from "botyo-api";
export default class TaskScheduler {
    private readonly registry;
    private readonly logger;
    private readonly taskToIntervalMap;
    private readonly taskToCronJobMap;
    private readonly taskToExecutePromiseMap;
    private readonly myBluebird;
    constructor(registry: ModuleRegistry, logger: Logger);
    start(): void;
    stop(): void;
    private runTask;
}
