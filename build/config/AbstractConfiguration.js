"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractConfiguration {
    getOrElse(property, other) {
        return this.hasProperty(property) ? this.getProperty(property) : other;
    }
}
exports.AbstractConfiguration = AbstractConfiguration;
//# sourceMappingURL=AbstractConfiguration.js.map