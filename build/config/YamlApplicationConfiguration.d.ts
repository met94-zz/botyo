/// <reference types="node" />
import { ApplicationConfiguration, Constructor, ContextualizableModuleConfiguration, Module } from "botyo-api";
import { AbstractConfiguration } from "./AbstractConfiguration";
export default class YamlApplicationConfiguration extends AbstractConfiguration implements ApplicationConfiguration {
    private config;
    private rawConfigObj;
    constructor(path: string);
    constructor(rawConfigBuffer: Buffer);
    private initialise;
    getProperty(property: string): any;
    hasProperty(property: string): boolean;
    setProperty(property: string, value: any): void;
    forModule(moduleConstructor: Constructor<Module>): ContextualizableModuleConfiguration;
    getRawObject(): object;
    private static expandConfig;
}
