import { LoggerInstance } from "winston";
export declare const LOGGER_NAME: unique symbol;
declare namespace LoggingUtils {
    function createLogger(label?: string, handleUncaughtExceptions?: boolean): LoggerInstance;
}
export default LoggingUtils;
