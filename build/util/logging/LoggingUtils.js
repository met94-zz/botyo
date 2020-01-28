"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const Console = winston_1.transports.Console;
exports.LOGGER_NAME = Symbol.for("BOTYO_LOGGER_NAME");
var LoggingUtils;
(function (LoggingUtils) {
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