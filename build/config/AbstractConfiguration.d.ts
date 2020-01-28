import { Configuration } from "botyo-api";
export declare abstract class AbstractConfiguration implements Configuration {
    abstract getProperty<T = any>(property: string): T;
    getOrElse<O, T = any>(property: string, other: O): T | O;
    abstract hasProperty(property: string): boolean;
    abstract setProperty<T = any>(property: string, value: T): void;
    abstract getRawObject(): object;
}
