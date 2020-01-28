"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeUtils;
(function (TypeUtils) {
    function containsNoUndefined(...args) {
        return !args.includes(undefined);
    }
    function isBundle(it) {
        return containsNoUndefined(it.modules, it.asyncResolvables);
    }
    TypeUtils.isBundle = isBundle;
    function isAsyncResolvable(it) {
        return containsNoUndefined(it.resolve, it.getServiceIdentifier);
    }
    TypeUtils.isAsyncResolvable = isAsyncResolvable;
    function isConfiguration(it) {
        return containsNoUndefined(it.getProperty, it.getOrElse, it.hasProperty, it.setProperty, it.getRawObject);
    }
    TypeUtils.isConfiguration = isConfiguration;
    function isApplicationConfiguration(it) {
        if (!isConfiguration(it))
            return false;
        return containsNoUndefined(it.getProperty, it.getOrElse, it.hasProperty, it.setProperty, it.getRawObject);
    }
    TypeUtils.isApplicationConfiguration = isApplicationConfiguration;
    function isModule(it) {
        return containsNoUndefined(it.getRuntime, it.onListen, it.onShutdown);
    }
    TypeUtils.isModule = isModule;
    function isCommandErrorHandlerModule(it) {
        if (!isModule(it))
            return false;
        return it.handle !== undefined;
    }
    TypeUtils.isCommandErrorHandlerModule = isCommandErrorHandlerModule;
    function isCommandModule(it) {
        if (!isModule(it))
            return false;
        return containsNoUndefined(it.getCommand, it.getDescription, it.getUsage, it.validate, it.execute);
    }
    TypeUtils.isCommandModule = isCommandModule;
    function isFilterModule(it) {
        if (!isModule(it))
            return false;
        return it.filter !== undefined;
    }
    TypeUtils.isFilterModule = isFilterModule;
    function isScheduledTaskModule(it) {
        if (!isModule(it))
            return false;
        return containsNoUndefined(it.execute, it.getSchedule, it.shouldExecuteOnStart);
    }
    TypeUtils.isScheduledTaskModule = isScheduledTaskModule;
    function likeInstanceOf(obj, clazz) {
        if (obj instanceof clazz)
            return true;
        if (!(obj instanceof Object))
            return false;
        return isClassDescendantOf(obj.constructor, clazz);
    }
    TypeUtils.likeInstanceOf = likeInstanceOf;
    function isClassDescendantOf(clazz, parentClazz) {
        if (parentClazz.isPrototypeOf(clazz))
            return true;
        const clazzProtoChain = getPrototypeChain(clazz).map(c => c.name);
        const parentProtoChain = getPrototypeChain(parentClazz).map(c => c.name);
        const idx = clazzProtoChain.lastIndexOf(parentProtoChain[0]);
        if (idx === -1)
            return false;
        return clazzProtoChain.slice(idx).every((v, i) => v === parentProtoChain[i]);
    }
    TypeUtils.isClassDescendantOf = isClassDescendantOf;
    function getPrototypeChain(clazz) {
        const chain = [];
        let ctor = clazz;
        while (ctor !== null) {
            chain.push(ctor);
            ctor = Object.getPrototypeOf(ctor);
        }
        return chain;
    }
    TypeUtils.getPrototypeChain = getPrototypeChain;
    function ifLikeInstanceOf(obj, clazz, fn) {
        if (likeInstanceOf(obj, clazz)) {
            fn(obj);
        }
    }
    TypeUtils.ifLikeInstanceOf = ifLikeInstanceOf;
})(TypeUtils || (TypeUtils = {}));
exports.default = TypeUtils;
//# sourceMappingURL=TypeUtils.js.map