import { ApplicationConfiguration, Constructor, ContextualizableModuleConfiguration, Module } from "botyo-api";
import { AbstractConfiguration } from "./AbstractConfiguration";
export default class YamlApplicationConfiguration extends AbstractConfiguration implements ApplicationConfiguration {
    private readonly config;
    private rawConfigObj;
    constructor(path: string);
    getProperty(property: string): any;
    hasProperty(property: string): boolean;
    setProperty(property: string, value: any): void;
    forModule(moduleConstructor: Constructor<Module>): ContextualizableModuleConfiguration;
    getRawObject(): object;
    private static expandConfig;
}
