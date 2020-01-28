import { ApplicationConfiguration, ChatThreadParticipantConsumer, ChatThreadUtils, FacebookId, Logger, Message } from "botyo-api";
export default class ChatThreadUtilsImpl implements ChatThreadUtils {
    private readonly appConfig;
    private readonly logger;
    constructor(appConfig: ApplicationConfiguration, logger: Logger);
    getChatThreadIds(): FacebookId[];
    getNickname(threadId: FacebookId, participantId: FacebookId): string | undefined;
    getNicknameByMessage(msg: Message): string | undefined;
    getName(userId: FacebookId): string;
    getNameByMessage(msg: Message): string;
    getFirstName(userId: FacebookId): string;
    getFirstNameByMessage(msg: Message): string;
    getParticipantIdByAddressee(threadId: FacebookId, addressee: string): FacebookId | undefined;
    forEachParticipantInEachChatThread(consumer: ChatThreadParticipantConsumer): void | Promise<void>;
}
