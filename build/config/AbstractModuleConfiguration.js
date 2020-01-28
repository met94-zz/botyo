"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractConfiguration_1 = require("./AbstractConfiguration");
class AbstractModuleConfiguration extends AbstractConfiguration_1.AbstractConfiguration {
    isEnabled() {
        return this.getOrElse("enable", true);
    }
    resolveModulePropertyPath(property) {
        return `modules` +
            `.${this.moduleConstructor.name}` +
            (property !== undefined && property !== "" ? `.${property}` : "");
    }
}
exports.AbstractModuleConfiguration = AbstractModuleConfiguration;
//# sourceMappingURL=AbstractModuleConfiguration.js.map