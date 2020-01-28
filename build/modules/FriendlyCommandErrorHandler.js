"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botyo_api_1 = require("botyo-api");
class FriendlyCommandErrorHandler extends botyo_api_1.AbstractCommandErrorHandlerModule {
    async handle(err, message, commandModule) {
        const firstName = this.getRuntime().getChatThreadUtils().getFirstNameByMessage(message);
        const sorryText = firstName ? `Sorry, ${firstName}` : "Sorry";
        return this.getRuntime().getChatApi().sendMessage(message.threadID, `${sorryText}. Something went wrong. :/`);
    }
}
exports.default = FriendlyCommandErrorHandler;
//# sourceMappingURL=FriendlyCommandErrorHandler.js.map