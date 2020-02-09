"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const Console = winston_1.transports.Console;
exports.LOGGER_NAME = Symbol.for("BOTYO_LOGGER_NAME");
var LoggingUtils;
(function (LoggingUtils) {
    function objectDumper(arr, level) {
        var dumped_text = "";
        if (!level)
            level = 0;
        var level_padding = "";
        for (var j = 0; j < level + 1; j++)
            level_padding += "    ";
        if (typeof (arr) == 'object') {
            for (var item in arr) {
                var value = arr[item];
                if (typeof (value) == 'object') {
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += objectDumper(value, level + 1);
                }
                else {
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        }
        else {
            dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
        }
        return dumped_text;
    }
    LoggingUtils.objectDumper = objectDumper;
    function createLogger(label = "Botyo", handleUncaughtExceptions = false) {
        return new winston_1.Logger({
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
    LoggingUtils.createLogger = createLogger;
})(LoggingUtils || (LoggingUtils = {}));
exports.default = LoggingUtils;
//# sourceMappingURL=LoggingUtils.js.map