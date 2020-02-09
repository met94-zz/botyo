import { Logger, LoggerInstance, transports } from "winston";

const Console = transports.Console;

export const LOGGER_NAME = Symbol.for("BOTYO_LOGGER_NAME");

namespace LoggingUtils
{
    export function objectDumper(arr: any, level: any) {
        var dumped_text = "";
        if (!level) level = 0;

        var level_padding = "";
        for (var j = 0; j < level + 1; j++) level_padding += "    ";

        if (typeof (arr) == 'object') {
            for (var item in arr) {
                var value = arr[item];

                if (typeof (value) == 'object') {
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += objectDumper(value, level + 1);
                } else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        } else {
            dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
        }
        return dumped_text;
    }
    export function createLogger(label: string = "Botyo", handleUncaughtExceptions = false): LoggerInstance
    {
        return new Logger({
            transports: [new Console({
                level: 'verbose',
                colorize: true,
                timestamp: true,
                label: label,
                handleExceptions: handleUncaughtExceptions,
                humanReadableUnhandledException: true
            })]
        });
    }
}

export default LoggingUtils;