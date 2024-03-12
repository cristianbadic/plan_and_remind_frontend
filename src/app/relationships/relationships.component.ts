import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserSearch } from '../shared/models/user-search.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-relationships',
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.css']
})
export class RelationshipsComponent implements OnInit {
  public incomingRequests: UserSearch[] = [];
  public friends: UserSearch[] = [];
  public outgoingRequests: UserSearch[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getIncomingRequests();
    
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.getIncomingRequests();
    }
    if (event.index === 1) {
      this.getFriends();
    }

    if (event.index === 2) {
      this.getOutgoingRequests();
    }
  }

  private getIncomingRequests(): void {
    this.userService.getAllReceivedRequestsCurrentUser().subscribe(
      {
        next: (response: UserSearch[]) =>  {
          this.incomingRequests = response;
          },
        
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });
  }

  private getFriends(): void {
    this.userService.getAllFriendsCurrentUser().subscribe(
      {
        next: (response: UserSearch[]) =>  {
          this.friends = response;
          },
        
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });
  }

  private getOutgoingRequests(): void {
    this.userService.getAllSentRequestsCurrentUser().subscribe(
      {
        next: (response: UserSearch[]) =>  {
          this.outgoingRequests = response;
          },
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });
  }
}
