import { AbstractConfiguration } from "./AbstractConfiguration";
import { Constructor, Module, ModuleConfiguration } from "botyo-api";
export declare abstract class AbstractModuleConfiguration extends AbstractConfiguration implements ModuleConfiguration {
    protected abstract readonly moduleConstructor: Constructor<Module>;
    isEnabled(): boolean;
    protected resolveModulePropertyPath(property?: string): string;
}
