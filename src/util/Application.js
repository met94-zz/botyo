import { dependencies as Inject } from "needlepoint";
import Promise from "bluebird";
import ChatApi from "./ChatApi";
import Configuration from "./Configuration";
import ThreadFilter from "../modules/filters/ThreadFilter";
import TrimmingFilter from "../modules/filters/TrimmingFilter";
import CommandExecutorFilter from "../modules/filters/CommandExecutorFilter";
import AutoEmojifyFilter from "../modules/filters/AutoEmojifyFilter";
import HeIsRisenFilter from "../modules/filters/HeIsRisenFilter";

@Inject(Configuration, ChatApi,
    ThreadFilter,
    TrimmingFilter,
    CommandExecutorFilter,
    AutoEmojifyFilter,
    HeIsRisenFilter
)
export default class Application {
    /**
     * @param {Configuration} config
     * @param {ChatApi} api
     * @param {ThreadFilter} threadFilter
     * @param {TrimmingFilter} trimmingFilter
     * @param {CommandExecutorFilter} commandExecutorFilter
     * @param {AutoEmojifyFilter} autoEmojifyFilter
     * @param {HeIsRisenFilter} heIsRisenFilter
     */
    constructor(config, api, threadFilter, trimmingFilter, commandExecutorFilter, autoEmojifyFilter, heIsRisenFilter) {
        this.config = config;
        this.api = api;

        this.threadFilter = threadFilter;
        this.trimmingFilter = trimmingFilter;
        this.commandExecutorFilter = commandExecutorFilter;
        this.autoEmojifyFilter = autoEmojifyFilter;
        this.heIsRisenFilter = heIsRisenFilter;
    }

    start() {
        return this.api.listen((err, msg) => {
            if (err) return Promise.reject(err);

            return Promise.resolve(msg)
                .then(msg => this.threadFilter.filter(msg))
                .then(msg => this.trimmingFilter.filter(msg))
                .then(msg => this.commandExecutorFilter.filter(msg))
                .then(msg => this.autoEmojifyFilter.filter(msg))
                .then(msg => this.heIsRisenFilter.filter(msg));
        });
    }
}