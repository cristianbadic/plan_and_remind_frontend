import { Injectable } from "@angular/core";
import { LoggedUser } from "../shared/models/logged-user.model";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable, take } from "rxjs";
import { FriendRequest } from "../shared/models/friend-request.model";

@Injectable({providedIn: 'root'})
export class FriendRequestService {
  private  serverUrl : string = "http://localhost:8080/friend";
  currentUser: LoggedUser;

  constructor(private http: HttpClient, private authService: AuthService){}
  

  public sendRequest(secondId: number): Observable<void> {

    this.authService.user.pipe(take(1)).subscribe(user => {
    this.currentUser = user;
    });

    const friendRequest = new FriendRequest(this.currentUser.id, secondId);

    return this.http.post<void>(this.serverUrl+ "/create-request", friendRequest);
  }

  public updateRequest(requestId: number): Observable<void> {
    return this.http.put<void>(this.serverUrl+ "/update-request/" + requestId, null);
  }

   public deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(this.serverUrl+ "/delete-request/" + id);
  }
}