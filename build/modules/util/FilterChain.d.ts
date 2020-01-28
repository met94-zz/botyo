import ModuleRegistry from "../../util/ioc/ModuleRegistry";
import { Logger, Message } from "botyo-api";
export default class FilterChain {
    private readonly moduleRegistry;
    private readonly logger;
    constructor(moduleRegistry: ModuleRegistry, logger: Logger);
    pass(msg: Message): Promise<void>;
}
