import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationReminderResponse } from '../shared/models/notification-reminder-response.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  public notifications: NotificationReminderResponse[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.notificationService.getAllNotificationForUser().subscribe(
      {
        next: (response: NotificationReminderResponse[]) => {
          this.notifications = response;
          this.notifications.forEach((notification) => {
            notification.expanded = false; // or true if you want to show full message by default
          });
        },
        error: (error: HttpErrorResponse) => alert(error.message)
      }
    );
  }

  deleteNotification(notification: NotificationReminderResponse): void {
    this.notificationService.deleteNotification(notification.id, notification.type).subscribe(
      {
        next: () => {
          const index = this.notifications.indexOf(notification);
          if (index !== -1) {
            this.notifications.splice(index, 1);
          }
        },
        error: (error: HttpErrorResponse) => alert(error.message)
      }
    );
  }

  deleteAllNotifications(): void {
    this.notificationService.deleteAllNotificationOfUser().subscribe(
      {
        next: () => {
          this.notifications = [];
        },
        error: (error: HttpErrorResponse) => alert(error.message)
      }
    );
  }

  toggleMessageExpand(notification: NotificationReminderResponse): void {

    
    notification.expanded = !notification.expanded;
    if (notification.seen === 0){
      notification.seen = 1;
      this.notificationService.seenNotificationOrReminder(notification.id, notification.type).subscribe(
        {
          next: () => {
          },
          error: (error: HttpErrorResponse) => alert(error.message)
        }
      );
    }
    
  }

  getUncheckedNotificationsCount(): number {
    return this.notifications.filter(notification => notification.seen === 0).length;
  }
}
