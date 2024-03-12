import {Injectable} from '@angular/core';
import {LoggedUser} from "../shared/models/logged-user.model";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable, take} from "rxjs";
import {EventResponseModel} from "../shared/models/event-response.model";
import { EventAddRequest } from '../shared/models/event-add-request.model';
import { CheckOverlapRequest } from '../shared/models/check-overlap-request.model';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { InviteFriendsRequestModel } from '../shared/models/invite-friends-request.model';
import { ReminderRequest } from '../shared/models/reminder-request.model';

let GET_ALL_NEED_TO_RESPOND = "";
let GET_ALL_UPCOMING_EVENTS = "";
let GET_ALL_PAST_EVENTS = "";
let DELETE_SINGLE_EVENT = "";
let DELETE_PAST_GROUP_EVENT = "";
let DELETE_PAST_INVITE_EVENT = "";
let DELETE_GROUP_EVENT = "";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private  serverUrl : string = "http://localhost:8080/event";
  currentUser: LoggedUser;
  constructor(private http: HttpClient, private authService: AuthService) {
    GET_ALL_NEED_TO_RESPOND = "/get-all/upcoming-to-respond/"
    GET_ALL_UPCOMING_EVENTS = "/get-all/upcoming-sorted/"
    DELETE_SINGLE_EVENT = "/delete-single/"
    DELETE_GROUP_EVENT = "/cancel-upcoming/"
    DELETE_PAST_GROUP_EVENT = "/delete-past-group/"
    DELETE_PAST_INVITE_EVENT = "/delete-invitation/"
    GET_ALL_PAST_EVENTS = "/get-all/past-sorted/"
  }

  getAllUpcomingInvitations(): Observable<EventResponseModel[]>
  {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    return this.http.get<EventResponseModel[]>(this.serverUrl + GET_ALL_NEED_TO_RESPOND + this.currentUser.id);
  }


  getAllUpcomingEvents() : Observable<EventResponseModel[]> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    return this.http.get<EventResponseModel[]>(this.serverUrl + GET_ALL_UPCOMING_EVENTS + this.currentUser.id);
  }
  getAllPastEvents() : Observable<EventResponseModel[]> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    return this.http.get<EventResponseModel[]>(this.serverUrl + GET_ALL_PAST_EVENTS + this.currentUser.id);
  }

  deleteSingleEvent(eventId : number) : Observable<any> {
    return this.http.delete(this.serverUrl + DELETE_SINGLE_EVENT + eventId);
  }
  deleteGroupEvent(eventId : number) : Observable<any> {
    return this.http.delete(this.serverUrl + DELETE_GROUP_EVENT + eventId);
  }

  deletePastGroupEvent(eventId: number) : Observable<any> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    return this.http.delete(this.serverUrl + DELETE_PAST_GROUP_EVENT + eventId + "/"+ this.currentUser.id)
  }
  deletePastInvite(eventId: number) : Observable<any> {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    return this.http.delete( this.serverUrl + "/delete-invitation/" + eventId + "/"+ this.currentUser.id)
  }

  public addEvent(event: EventAddRequest): Observable<void> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    event.creatorId = this.currentUser.id;
  
    return this.http.post<void>(this.serverUrl+ "/create", event)
  }

  public updateSingleEvent(event: EventAddRequest, eventId: number): Observable<void> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    
    event.creatorId = this.currentUser.id;
    return this.http.put<void>(this.serverUrl+ "/update/" + eventId, event)
  }

  public checkOverlapWithOtherEvents(overlapData: CheckOverlapRequest): Observable<OverlapResponse[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    const id = this.currentUser.id;

    return this.http.post<OverlapResponse[]>(this.serverUrl+ "/check-overlap/" + id, overlapData);
  }

  public checkOverlapWithOtherEventsForUpdates(overlapData: CheckOverlapRequest, eventId: number): Observable<OverlapResponse[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    const id = this.currentUser.id;

    return this.http.post<OverlapResponse[]>(this.serverUrl+ "/check-overlap-for-update/" + id + "/" + eventId, overlapData);
  }

  public inviteAdditionalFriends(friendsList: InviteFriendsRequestModel, eventId: number): Observable<void>{

    return this.http.put<void>(this.serverUrl+ "/add-new-invitees/" + eventId, friendsList)
  }


  public getEventToEdit(eventId: number): Observable<EventAddRequest> {

    return this.http.get<EventAddRequest>(this.serverUrl+ "/get/single-event-to-update/" + eventId);
  }


  public getGroupEventToEdit(eventId: number, relationToEvent: number): Observable<EventAddRequest> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    const id = this.currentUser.id;

    return this.http.get<EventAddRequest>(this.serverUrl+ "/get/group-event-to-update/" + eventId + "/" + id + "/" + relationToEvent);
  }

  public updateGroupEventCreatedReminders(eventId: number, reminderDetails: ReminderRequest): Observable<void>{

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    const id = this.currentUser.id

    return this.http.put<void>(this.serverUrl+ "/update-group-creator-reminder/" + eventId + "/" + id, reminderDetails)
  }

  public updateGroupEventInvitedReminders(eventId: number, reminderDetails: ReminderRequest): Observable<void>{

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    const id = this.currentUser.id

    return this.http.put<void>(this.serverUrl+ "/update-group-invitee-reminder/" + eventId + "/" + id, reminderDetails)
  }
}
