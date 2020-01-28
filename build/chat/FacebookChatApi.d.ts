import { ChatApi, EndTypingIndicatorFunction, FacebookId, Message, MessageHandler, MessageListener, OutgoingMessage, Reaction, StopListeningFunction, ThreadInfo, UserIdSearchResult, UserInfoResult } from "botyo-api";
import FacebookLoginHelper from "../util/FacebookLoginHelper";
export declare class FacebookChatApi implements ChatApi, MessageListener {
    private facebookChatApi;
    private readonly facebookLoginHelper;
    private readonly facebookChatApiFnToPromisifiedFnMap;
    private loginPromise?;
    private handler?;
    private stopListeningFn?;
    private readonly logger;
    constructor(facebookChatApi: any, facebookLoginHelper: FacebookLoginHelper);
    listen(handler: MessageHandler): StopListeningFunction;
    sendMessage(threadId: FacebookId, message: OutgoingMessage | string): Promise<Message>;
    changeThreadColor(threadId: FacebookId, color: string): Promise<void>;
    getThreadInfo(threadId: FacebookId): Promise<ThreadInfo>;
    getThreadHistory(threadId: FacebookId, amount: number, timestamp?: number): Promise<Message[]>;
    sendTypingIndicator(threadId: FacebookId): Promise<EndTypingIndicatorFunction>;
    private makeEndTypingIndicatorFunction;
    markAsRead(threadId: FacebookId): Promise<void>;
    getUserInfo(ids: FacebookId | FacebookId[]): Promise<UserInfoResult>;
    getUserId(name: string): Promise<UserIdSearchResult[]>;
    getCurrentUserId(): FacebookId;
    handleMessageRequest(threadId: FacebookId, shouldAccept: boolean): Promise<void>;
    setMessageReaction(messageId: FacebookId, reaction: Reaction | string): Promise<void>;
    resolvePhotoUrl(photoId: FacebookId): Promise<string>;
    private wrap;
    /**
     * Handles the "errorSummary=Sorry, something went wrong, errorDescription=Please try closing and re-opening
     * your browser window." error that persists after the bot has been logged in for a long period of time
     */
    private attachReloginErrorHandler;
    private cachify;
}
