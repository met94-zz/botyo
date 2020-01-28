import { AbstractEmptyAsyncResolvable, ApplicationConfiguration, ChatApi, ChatThreadUtils, Logger } from "botyo-api";
export default class AsyncResolvableChatParticipantsResolver extends AbstractEmptyAsyncResolvable {
    private readonly chatApi;
    private readonly applicationConfiguration;
    private readonly logger;
    private readonly chatThreadUtils;
    private readonly vanityNameToUserIdMap;
    constructor(chatApi: ChatApi, applicationConfiguration: ApplicationConfiguration, logger: Logger, chatThreadUtils: ChatThreadUtils);
    resolve(): Promise<void>;
    resolveDeclaredVanityNamesToIds(): Promise<void>;
    populateActualParticipants(): Promise<void>;
    populateParticipantsInfo(): Promise<void>;
    private static isAccountInactive;
}
