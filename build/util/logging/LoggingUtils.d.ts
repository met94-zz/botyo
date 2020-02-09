import { LoggerInstance } from "winston";
export declare const LOGGER_NAME: unique symbol;
declare namespace LoggingUtils {
    function objectDumper(arr: any, level: any): string;
    function createLogger(label?: string, handleUncaughtExceptions?: boolean): LoggerInstance;
}
export default LoggingUtils;
