export interface NotificationReminderResponse {
    id: number;
    message: string;
    seen: number,
    status: string;
    createdAt: string;
    type: string;
    expanded?:boolean;
  }