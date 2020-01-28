import { interfaces } from "inversify";
import { ApplicationConfiguration, AsyncResolvable, Bundle, CommandErrorHandlerModule, CommandModule, Configuration, FilterModule, Module, ScheduledTaskModule } from "botyo-api";
import Newable = interfaces.Newable;
import Abstract = interfaces.Abstract;
declare namespace TypeUtils {
    function isBundle(it: any): it is Bundle;
    function isAsyncResolvable(it: any): it is AsyncResolvable<any>;
    function isConfiguration(it: any): it is Configuration;
    function isApplicationConfiguration(it: any): it is ApplicationConfiguration;
    function isModule(it: any): it is Module;
    function isCommandErrorHandlerModule(it: any): it is CommandErrorHandlerModule;
    function isCommandModule(it: any): it is CommandModule;
    function isFilterModule(it: any): it is FilterModule;
    function isScheduledTaskModule(it: any): it is ScheduledTaskModule;
    function likeInstanceOf(obj: any, clazz: Function): boolean;
    function isClassDescendantOf(clazz: Function, parentClazz: Function): boolean;
    function getPrototypeChain(clazz: Function): Function[];
    function ifLikeInstanceOf<T>(obj: any, clazz: Newable<T> | Abstract<T>, fn: (arg: T) => any): void;
}
export default TypeUtils;
