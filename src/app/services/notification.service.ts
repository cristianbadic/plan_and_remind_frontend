import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggedUser } from '../shared/models/logged-user.model';
import { NotificationReminderResponse } from '../shared/models/notification-reminder-response.model';

@Injectable({providedIn: 'root'})
export class NotificationService {
  private  serverUrl : string = " http://localhost:8080/reminder";
  currentUser: LoggedUser;

  constructor(private http: HttpClient, private authService: AuthService){}

  public getAllNotificationForUser(): Observable<NotificationReminderResponse[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;
    return this.http.get<NotificationReminderResponse[]>(this.serverUrl+ "/get-all/reminders-and-notifications/" + id)
  }

  public deleteNotification(id: Number, type: string): Observable<void> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

  const userId = this.currentUser.id;

    return this.http.delete<void>(this.serverUrl+ "/delete/reminder-or-notification/" + id + "/" + userId + "/" + type);
  }

  public deleteAllNotificationOfUser(): Observable<void> {

    this.authService.user.pipe(take(1)).subscribe(user => {
        this.currentUser = user;
      });
  
    const id = this.currentUser.id;
    return this.http.delete<void>(this.serverUrl+ "/delete-all/reminders-and-notifications/" + id);
  } 

  // a notification was seen
  public seenNotificationOrReminder(id: Number, type: string): Observable<void> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const userId = this.currentUser.id;

    return this.http.put<void>(this.serverUrl+ "/seen/reminder-or-notification/" + id + "/" + userId + "/" + type, null);
  }

}