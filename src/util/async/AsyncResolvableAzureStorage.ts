import { ApplicationConfiguration, AsyncResolvable, ServiceIdentifier, AzureStorage } from "botyo-api";
import { inject, injectable } from "inversify";
import { BlobServiceClient } from '@azure/storage-blob';

@injectable()
export class AsyncResolvableAzureStorage implements AsyncResolvable<BlobServiceClient | null>
{
    private readonly connectionString: string | null;

    constructor(@inject(ApplicationConfiguration.SYMBOL) private readonly appConfig: ApplicationConfiguration)
    {
        this.connectionString = appConfig.getOrElse("azure.storage", null);
    }

    async resolve(): Promise<BlobServiceClient | null>
    {
        if (this.connectionString == null)
        {
            return null;
        }
        return await BlobServiceClient.fromConnectionString(this.connectionString);
    }

    getServiceIdentifier(): ServiceIdentifier<BlobServiceClient>
    {
        return AzureStorage.SYMBOL;
    }
}