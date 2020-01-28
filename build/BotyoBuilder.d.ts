import { ApplicationConfiguration, AsyncResolvable, Bundle, CommandErrorHandlerModule, Constructor, Module } from "botyo-api";
import Botyo from "./Botyo";
export default class BotyoBuilder {
    private static readonly DEFAULT_CONFIG_FILE;
    private readonly asyncResolvables;
    private readonly modules;
    private readonly moduleConfigs;
    private commandErrorHandler;
    private applicationConfigurationProvider;
    configuration(config: ApplicationConfiguration | string): this;
    registerBundle(bundle: Bundle): this;
    registerAsyncResolvable<R>(clazz: Constructor<AsyncResolvable<R>>): this;
    registerModule<M extends Module>(clazz: Constructor<M>, config?: object): this;
    registerCommandErrorHandler<M extends CommandErrorHandlerModule>(clazz: Constructor<M>, config?: object): this;
    build(): Botyo;
    private static checkClass;
}
