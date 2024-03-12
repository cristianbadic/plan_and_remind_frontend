import { Component, Input, OnInit } from '@angular/core';
import { UserSearch } from '../shared/models/user-search.model';
import { FriendRequestService } from '../services/friend-request.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent {
  @Input() user: UserSearch;
  friendRequestSent: boolean = false;
  requestAccepted: boolean = false;
  requestDeclined: boolean = false;

  constructor(private friendRequestService: FriendRequestService){}


  public addFriend() {


    this.friendRequestService.sendRequest(this.user.userEntity.id).subscribe(
      {
        next: (response: void) =>  {
          },
        error: (error: HttpErrorResponse) =>  {
          alert(error.message);
        }
    });

    this.friendRequestSent = true;
  }
  
  public acceptRequest() {

    this.friendRequestService.updateRequest(this.user.requestId).subscribe(
      {
        next: (response: void) =>  {
          },
        error: (error: HttpErrorResponse) =>  {
          alert(error.message);
        }
    });

    this.requestAccepted = true;
    
  }
  
  public declineRequest() {

    this.friendRequestService.deleteRequest(this.user.requestId).subscribe(
      {
        next: (response: void) =>  {
          },
        error: (error: HttpErrorResponse) =>  {
          alert(error.message);
        }
    });

    this.requestDeclined = true;
  }

  onImageError() {
    this.user.userEntity.imageUrl =
      'https://upload.wikimedia.org/wikipedia/commons/7/71/Black.png';
  }
}
