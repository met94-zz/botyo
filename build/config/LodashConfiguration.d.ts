import { AbstractConfiguration } from "./AbstractConfiguration";
export default class LodashConfiguration extends AbstractConfiguration {
    private readonly rawConfigObj;
    constructor(rawConfigObj: object);
    getProperty(property: string): any;
    hasProperty(property: string): boolean;
    setProperty(property: string, value: any): void;
    getRawObject(): object;
}
