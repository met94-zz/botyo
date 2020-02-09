import { ApplicationConfiguration, AsyncResolvable, ServiceIdentifier } from "botyo-api";
import { BlobServiceClient } from '@azure/storage-blob';
export declare class AsyncResolvableAzureStorage implements AsyncResolvable<BlobServiceClient | null> {
    private readonly appConfig;
    private readonly connectionString;
    constructor(appConfig: ApplicationConfiguration);
    resolve(): Promise<BlobServiceClient | null>;
    getServiceIdentifier(): ServiceIdentifier<BlobServiceClient>;
}
