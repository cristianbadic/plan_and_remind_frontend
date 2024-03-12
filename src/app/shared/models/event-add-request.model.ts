export interface EventAddRequest {
    name: string;
    eventType: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    limitDate?: string;
    creatorId: number;
    defaultReminder: string;
    sentTo: string;
    timeFormat: string;
    amountBefore: number;
    inviteeIDs: number[];
}
  