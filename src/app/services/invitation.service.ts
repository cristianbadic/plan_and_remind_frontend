import { Injectable } from '@angular/core';
import {Observable, take} from "rxjs";
import {LoggedUser} from "../shared/models/logged-user.model";
import {AuthService} from "./auth.service";
import {HttpClient} from "@angular/common/http";
import { ReminderRequest } from '../shared/models/reminder-request.model';

let DECLINE_INVITATION = "";
@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private  serverUrl : string = "http://localhost:8080/invitation";
  currentUser: LoggedUser;
  constructor(private authService : AuthService,
              private http : HttpClient) {
    DECLINE_INVITATION = "/decline/"

  }

  declineInvitation(eventId: number): Observable<any> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    return this.http.put(this.serverUrl + DECLINE_INVITATION + this.currentUser.id + "/" + eventId, [])
  }

  acceptInvitation(eventId: number, addReminderBody: ReminderRequest): Observable<any> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    return this.http.put(this.serverUrl + "/accept/" + this.currentUser.id + "/" + eventId, addReminderBody)
  }
}
