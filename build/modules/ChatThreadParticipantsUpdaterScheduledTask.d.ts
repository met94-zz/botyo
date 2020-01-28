import { AbstractScheduledTaskModule } from "botyo-api";
import AsyncResolvableChatParticipantsResolver from "../util/async/AsyncResolvableChatParticipantsResolver";
export default class ChatThreadParticipantsUpdaterScheduledTask extends AbstractScheduledTaskModule {
    private readonly resolver;
    constructor(resolver: AsyncResolvableChatParticipantsResolver);
    execute(): Promise<void>;
    shouldExecuteOnStart(): boolean;
    getSchedule(): string | number;
    static readonly DEFAULT_INTERVAL: number;
}
