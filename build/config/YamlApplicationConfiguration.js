"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botyo_api_1 = require("botyo-api");
const fs = require("fs");
const YAML = require("js-yaml");
const _ = require("lodash");
const LodashConfiguration_1 = require("./LodashConfiguration");
const ModuleConfigurationImpl_1 = require("./ModuleConfigurationImpl");
const AbstractConfiguration_1 = require("./AbstractConfiguration");
class YamlApplicationConfiguration extends AbstractConfiguration_1.AbstractConfiguration {
    constructor(path) {
        super();
        if (!fs.existsSync(path)) {
            throw new Error(`Configuration file '${path}' does not exist`);
        }
        this.rawConfigObj = YAML.load(fs.readFileSync(path, 'utf8'));
        YamlApplicationConfiguration.expandConfig(this.rawConfigObj);
        this.config = new LodashConfiguration_1.default(this.rawConfigObj);
    }
    getProperty(property) {
        return this.config.getProperty(property);
    }
    hasProperty(property) {
        return this.config.hasProperty(property);
    }
    setProperty(property, value) {
        this.config.setProperty(property, value);
    }
    forModule(moduleConstructor) {
        return new ModuleConfigurationImpl_1.default(this, moduleConstructor);
    }
    getRawObject() {
        return this.rawConfigObj;
    }
    static expandConfig(obj, parentKey) {
        _.entries(obj).forEach(([key, val]) => {
            if (_.isPlainObject(val)) {
                YamlApplicationConfiguration.expandConfig(val, key);
            }
            if (_.isArray(val)) {
                Array.from(val).forEach(x => YamlApplicationConfiguration.expandConfig(val, key));
            }
            // skip expanding dots in vanity usernames
            if (([botyo_api_1.Constants.CONFIG_KEY_PARTICIPANTS].includes(parentKey))) {
                return;
            }
            if (key.includes('.')) {
                delete obj[key];
                _.set(obj, key, val);
            }
        });
    }
}
exports.default = YamlApplicationConfiguration;
//# sourceMappingURL=YamlApplicationConfiguration.js.map