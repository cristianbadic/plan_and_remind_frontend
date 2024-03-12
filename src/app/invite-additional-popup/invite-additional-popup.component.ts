import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';
import { UserSearch } from '../shared/models/user-search.model';
import { HttpErrorResponse } from '@angular/common/http';
import { InviteFriendsRequestModel } from '../shared/models/invite-friends-request.model';

@Component({
  selector: 'app-invite-additional-popup',
  templateUrl: './invite-additional-popup.component.html',
  styleUrls: ['./invite-additional-popup.component.css']
})
export class InviteAdditionalPopupComponent implements OnInit{

  
  addAdditionalFriendsForm: FormGroup;
  wasAdded:boolean = true;
  public friends: UserSearch[] = [];
  eventId: number;

  confirmedPhoneNr: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<InviteAdditionalPopupComponent>, 
  private eventService: EventService, private dialog: MatDialog, private userService: UserService) {

      this.eventId = data.id;

      this.userService.getStillPossibleToInviteFriends(this.eventId).subscribe(
        {
          next: (response: UserSearch[]) =>  {
            this.friends = response;
            },
          //vad mai incolo ce fac in legatura cu caz de eroare
          error: (error: HttpErrorResponse) =>  alert(error.message)
        });
    }

  ngOnInit() {

    this.addAdditionalFriendsForm = new FormGroup({
  
    invitees: new FormControl([]),
    
  },
  { validators: [] }
  );
  }

  onInviteeRemoved(friend: UserSearch) {
    const chosenFriends = this.addAdditionalFriendsForm.get('invitees').value;
    this.removeFirst(chosenFriends, friend);
    this.addAdditionalFriendsForm.get('invitees').setValue(chosenFriends); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  
  onSubmit(){

    if (this.addAdditionalFriendsForm.valid) {

      //create a list of inviteeIDs
      const inviteeIDs: number[] = this.addAdditionalFriendsForm.get('invitees').value.map(invitee => invitee.userEntity.id);

      const inviteAdditionalFriends: InviteFriendsRequestModel = {
        inviteeIDs: inviteeIDs
      }
      this.eventService.inviteAdditionalFriends(inviteAdditionalFriends, this.eventId).subscribe(
        {
          next: (response: any) =>  {
            this.dialogRef.close(true);
            },
          
          error: (error: HttpErrorResponse) =>  alert(error.message)
        });
    }
  }  

  closeDialog(){
    this.dialogRef.close();
    this.dialog.closeAll();
  }

}
 