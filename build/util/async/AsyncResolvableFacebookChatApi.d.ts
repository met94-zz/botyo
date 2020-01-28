import { AsyncResolvable, ChatApi, ServiceIdentifier } from "botyo-api";
import FacebookLoginHelper from "../FacebookLoginHelper";
export default class AsyncResolvableFacebookChatApi implements AsyncResolvable<ChatApi> {
    private readonly facebookLoginHelper;
    constructor(facebookLoginHelper: FacebookLoginHelper);
    resolve(): Promise<ChatApi>;
    getServiceIdentifier(): ServiceIdentifier<ChatApi>;
}
