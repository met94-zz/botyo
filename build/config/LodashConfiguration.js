"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const AbstractConfiguration_1 = require("./AbstractConfiguration");
class LodashConfiguration extends AbstractConfiguration_1.AbstractConfiguration {
    constructor(rawConfigObj) {
        super();
        this.rawConfigObj = rawConfigObj;
    }
    getProperty(property) {
        if (!this.hasProperty(property)) {
            throw new Error(`Property '${property}' was not found in configuration`);
        }
        return _.get(this.rawConfigObj, property);
    }
    hasProperty(property) {
        return _.has(this.rawConfigObj, property);
    }
    setProperty(property, value) {
        _.set(this.rawConfigObj, property, value);
    }
    getRawObject() {
        return this.rawConfigObj;
    }
}
exports.default = LodashConfiguration;
//# sourceMappingURL=LodashConfiguration.js.map