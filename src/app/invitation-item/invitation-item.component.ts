import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventResponseModel} from "../shared/models/event-response.model";
import {UserResponse} from "../shared/models/user-response.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {UserService} from "../services/user.service";
import {InvitedUserModel} from "../shared/models/invited-user.model";
import {InviteesListDialogComponent} from "../invitees-list-dialog/invitees-list-dialog.component";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import { CheckOverlapRequest } from '../shared/models/check-overlap-request.model';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { EventService } from '../services/event.service';
import { AcceptInvitationOverlapComponent } from '../accept-invitation-overlap/accept-invitation-overlap.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AcceptInvitationAddReminderComponent } from '../accept-invitation-add-reminder/accept-invitation-add-reminder.component';
@Component({
  selector: 'app-invitation-item',
  templateUrl: './invitation-item.component.html',
  styleUrls: ['./invitation-item.component.css']
})
export class InvitationItemComponent implements OnInit {
  @Input() eventInvite : EventResponseModel;
  @Output() declineInviteEvent = new EventEmitter<EventResponseModel>();

  @Output() acceptInvitation = new EventEmitter<void>();
  event : EventResponseModel;
  comingInvitees : InvitedUserModel[] =[];
  decliningInvitees : InvitedUserModel[] =[];
  pendingInvitees : InvitedUserModel[] =[];
  objectType : string ="";
  overlappingEvents: OverlapResponse[] = [];


  constructor(private dialog : MatDialog, private userService : UserService, private eventService: EventService, private snackBar: MatSnackBar) {
   
    //am nevoie doar de
    // eventDate,
    // creatorLastname,
    // creatorFirstName,
    // name,
    // description,
    // endTime,
    // limitDate,
    // specification
    // startTime

  }

  ngOnInit(){
    if (this.eventInvite != null) {
      this.event = this.eventInvite;
      this.objectType = "invite";

    }
    this.getUsersRelatedToEvent(this.event);
    const [eventStartTimeHour, eventStartTimeMinute] = this.event.startTime.split(":").slice(0, -1)
    this.event.startTime =  eventStartTimeHour + ":" + eventStartTimeMinute

    if (this.event.endTime != null){

      const [eventEndTimeHour, eventEndTimeMinute] = this.event.endTime.split(":").slice(0, -1);
      this.event.endTime =  eventEndTimeHour + ":" + eventEndTimeMinute;
    }
  }

  acceptEventInvite() {

    const checkOverlap: CheckOverlapRequest = {
      eventDate: this.event.eventDate,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
    }

    this.eventService.checkOverlapWithOtherEvents(checkOverlap).subscribe(
      {
        next: (response: OverlapResponse[]) =>  {
          this.overlappingEvents = response;

          //if there are overlappingEvents, we need to open the check-overlap popup
          if (this.overlappingEvents.length > 0) {

            const dialogRefForCheckPopup = this.dialog.open(AcceptInvitationOverlapComponent, {
              width: '500px',
              data: { overlappingEvents: this.overlappingEvents, event: this.event}
            });

            dialogRefForCheckPopup.afterClosed().subscribe(result => {
              if (result === true) {
                
                this.acceptInvitation.emit();
                this.snackBar.open("You have accepted the invitation to " + this.event.name + ".", 'Close', {
                  duration: 5000, 
                });
              }
            });

          } else {
            const dialogRefForCheckPopup = this.dialog.open(AcceptInvitationAddReminderComponent, {
              width: '500px',
              data: { acceptInvitation: 1, event: this.event, relationToEvent: -1}
            });

            dialogRefForCheckPopup.afterClosed().subscribe(result => {
              if (result === true) {
                
                this.acceptInvitation.emit();
                this.snackBar.open("You have accepted the invitation to " + this.event.name + ".", 'Close', {
                  duration: 5000, 
                });
              }
            });
          }
        },
        error: (error: HttpErrorResponse) =>  alert(error.message)
    });

    // this.event.specification = "invited_accepted"
  }
  
  declineEventInvite() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: "Are you sure you want to decline this event invitation?"})
    dialogRef.afterClosed().subscribe(response =>
    {
      if (response) {
        this.declineInviteEvent.emit(this.event);
      }
    })
  }

  //uses the userService to get the users invited to the current event
  //sorts these into 3 categories ==> 3 lists of users
  private getUsersRelatedToEvent(event: EventResponseModel) {

    this.userService.getAllInvitedUsersTo(event.id).subscribe( result =>
    {
      result.forEach( (invitee) =>
        {
          let inv = new InvitedUserModel(invitee);
          switch (invitee.statusToInvitation){
            case 'pending' :{

              this.pendingInvitees.push(invitee);
              break;
            }
            case 'accepted' : {
              this.comingInvitees.push(invitee);
              break;
            }
            case 'declined' : {
              this.decliningInvitees.push(invitee);
              break;
            }
          }
        }
      )
    })
  }

  openInviteesDialog(status : string, users : InvitedUserModel[]) {
    this.dialog.open(InviteesListDialogComponent, {data:{users:users, type:status}})
  }

}
