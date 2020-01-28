import { Container, interfaces } from "inversify";
import { ApplicationConfiguration, AsyncResolvable, Constructor, Module } from "botyo-api";
import ServiceIdentifier = interfaces.ServiceIdentifier;
export default class ApplicationContainer {
    private readonly container;
    private constructor();
    static create(): ApplicationContainer;
    bindApplicationConfiguration(ac: ApplicationConfiguration): void;
    bindToSelfAndGet<M extends Module>(moduleClass: Constructor<M>): M;
    bindAndGet<M extends Module>(serviceIdentifier: ServiceIdentifier<M>, moduleClass: Constructor<M>): M;
    bindAndResolveAsyncResolvable<R>(arClass: Constructor<AsyncResolvable<R>>): Promise<void>;
    getIoCContainer(): Container;
    private createModuleAwareRuntime;
    private decorateRoot;
    private bindInternals;
    private bindLogger;
}
