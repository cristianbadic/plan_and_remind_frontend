import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserSearch } from '../shared/models/user-search.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  public matchingUsers: UserSearch[] = [];
  public searchInput: string;
  public displayedMess: string;
  public secondName: string;
  public firstName: string;

  constructor(private userService: UserService){}

  ngOnInit() {
    this.displayedMess = 'Search for other users by their first name, last name, or both';
  }

  public searchUsers(): void {
    if (this.searchInput) {

      this.searchInput = this.searchInput.trimStart();
      
      //only one space between words
      this.searchInput = this.searchInput.replace(/\s+/g, ' ').trim();
      this.secondName =this.searchInput.substring(0, this.searchInput.indexOf(' ')); // empty string if no space present
      this.firstName =this.searchInput.substring(this.searchInput.indexOf(' ') + 1);

      this.userService.getSearchedUsers(this.firstName, this.secondName).subscribe(
        {
          next: (response: UserSearch[]) => {
            this.matchingUsers = response;

            if (this.matchingUsers.length === 0) {
              this.displayedMess = 'No users found for this search.';
            } else {
              this.displayedMess = null;
            }
          },
          error: (error: HttpErrorResponse) => alert(error.message)
       }
      );
    } else {
      this.matchingUsers = [];
      this.displayedMess = 'Search for other users by their first name, last name or both.';
    }
  }

}