import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, take, throwError } from 'rxjs';
import { User } from '../shared/models/user.model';
import { UserResponse } from '../shared/models/user-response.model';
import { AuthService } from './auth.service';
import { LoggedUser } from '../shared/models/logged-user.model';
import { UserSearch } from '../shared/models/user-search.model';
import {InvitedUserModel} from "../shared/models/invited-user.model";
import { ConfirmRegistration } from '../shared/models/confirm-registration.model';
import { ConfirmPhoneNr } from '../shared/models/confirm-phone-request.model';
import { AddPhoneNr } from '../shared/models/add-number-request.model';
import { InviteFriendsRequestModel } from '../shared/models/invite-friends-request.model';
import { UpdateUserModel } from '../shared/models/update-user-request.model';


@Injectable({providedIn: 'root'})
export class UserService {
  private  serverUrl : string = "http://localhost:8080/user";
  currentUser: LoggedUser;

  constructor(private http: HttpClient, private authService: AuthService){}

  public phoneNrStatus():boolean{
    
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const phoneNrStatus = this.currentUser.phoneNrConfirmation;

    if (phoneNrStatus === '1'){
      return true;
    }
    return false;

  }

  public getLoggedInUser(): LoggedUser{
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    return this.currentUser;
  }

  public getUserById(id: number): Observable<UserResponse>{

    return this.http.get<UserResponse>(this.serverUrl+ "/get-all/" + id)
  }

  public getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.serverUrl+ "/get-all")
  }

  public getUsersInRelationCurrentUser(): Observable<UserSearch[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;
    return this.http.get<UserSearch[]>(this.serverUrl+ "/get-all-users/" + id)
  }

  public getAllReceivedRequestsCurrentUser(): Observable<UserSearch[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;
    return this.http.get<UserSearch[]>(this.serverUrl+ "/get-all/received/" + id)
  }

  public getAllSentRequestsCurrentUser(): Observable<UserSearch[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;
    return this.http.get<UserSearch[]>(this.serverUrl+ "/get-all/sent/" + id)
  }

  public getAllFriendsCurrentUser(): Observable<UserSearch[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;

    return this.http.get<UserSearch[]>(this.serverUrl+ "/get-all/friends/" + id)
  }

  public getStillPossibleToInviteFriends(eventId: number): Observable<UserSearch[]> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;
    
    return this.http.get<UserSearch[]>(this.serverUrl+ "/get/still-possible-to-invite/" + id + "/" + eventId)
  }

  public getSearchedUsers(firstName: string, secondName:string): Observable<UserSearch[]> {


    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    let result: Observable<UserSearch[]>;
    const id = this.currentUser.id;
    if (!secondName){
      result = this.http.get<UserSearch[]>(this.serverUrl+ "/search/" + id +"/"+firstName);

    }else{
      result = this.http.get<UserSearch[]>(this.serverUrl+ "/search/" + id +"/"+firstName+"/"+secondName);
    }
    return result;
  }


  public addUser(user: User): Observable<void> {
    return this.http.post<void>(this.serverUrl+ "/register-user", user)
  }

  public updatePhoneNrConfirmationStatus(){
    this.authService.updatePhoneNrConfirmation();
  }

  public registerNumber(phoneNr:string): Observable<void>{
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;

    const confirmPhoneModel: AddPhoneNr = {
      id: id,
      phoneNumber: phoneNr
    }

    return this.http.put<void>(this.serverUrl+ "/register-phone-nr", confirmPhoneModel)
  }

  public confirmPhoneNr(confirmCode:string): Observable<void>{
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;

    const confirmPhoneModel: ConfirmPhoneNr = {
      id: id,
      phoneNrConfirmation: confirmCode
    }

    return this.http.put<void>(this.serverUrl+ "/confirm-phone-number", confirmPhoneModel)
  }

  public resendConfirmationSms(phoneNr:string): Observable<void>{
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;

    const confirmPhoneModel: AddPhoneNr = {
      id: id,
      phoneNumber: phoneNr
    }

    return this.http.put<void>(this.serverUrl+ "/resend-confirmation-phone-nr", confirmPhoneModel)
  }


  public confirmRegistration(confRegistrationModel: ConfirmRegistration): Observable<void> {
    return this.http.put<void>(this.serverUrl+ "/confirm-registration", confRegistrationModel)
  }

  public resendEmail(email: string): Observable<void> {
    return this.http.put<void>(this.serverUrl+ "/resend-confirmation-mail/" + email, null)
  }


  public updateUser(updateUserModel: UpdateUserModel): Observable<void> {

    this.authService.user.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });

    const id = this.currentUser.id;

    return this.http.put<void>(this.serverUrl+ "/update-user/" + id, updateUserModel);
  }


  public deleteUser(id: Number): Observable<void> {
    return this.http.delete<void>(this.serverUrl+ "/delete-user/" + id);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'There is already a user with this email!';

    return throwError(() => new Error(errorMessage));
  }

  public getAllInvitedUsersTo(eventId :number):Observable<InvitedUserModel[]> {

    return this.http.get<InvitedUserModel[]>(this.serverUrl + "/get-invited-users/" + eventId);
  }

}
