import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventResponseModel} from "../shared/models/event-response.model";
import {EventService} from "../services/event.service";
import {InvitedUserModel} from "../shared/models/invited-user.model";
import {InviteesListDialogComponent} from "../invitees-list-dialog/invitees-list-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../services/user.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import { InviteAdditionalPopupComponent } from '../invite-additional-popup/invite-additional-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddSinglePopupComponent } from '../add-single-popup/add-single-popup.component';
import { AcceptInvitationAddReminderComponent } from '../accept-invitation-add-reminder/accept-invitation-add-reminder.component';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css']
})
export class EventItemComponent implements OnInit{
  @Input() event : EventResponseModel;
  @Output() deleteSingleEventEvent = new EventEmitter<EventResponseModel>();
  @Output() deleteGroupEventEvent = new EventEmitter<void>();
  @Output() deletePastGroupEventEvent = new EventEmitter<EventResponseModel>();
  @Output() deletePastInviteEvent = new EventEmitter<EventResponseModel>();

  @Output() updateEventList = new EventEmitter<void>();

  @Output() updateRemindersForCreatedGroupEvent = new EventEmitter<void>();
  @Output() updateRemindersForInvitedToGroupEvent = new EventEmitter<void>();

  eventType : string;
  comingInvitees: InvitedUserModel[] = [];
  pendingInvitees: InvitedUserModel[]= [];
  decliningInvitees: InvitedUserModel[]= [];
  possibleToResponde: boolean = false;

  constructor(private dialog: MatDialog,
              private eventService: EventService,
              private userService: UserService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log(this.event);
    this.eventType = this.event.eventType
    this.getUsersRelatedToEvent(this.event)
    const [eventStartTimeHour, eventStartTimeMinute] = this.event.startTime.split(":").slice(0, -1)
    this.event.startTime =  eventStartTimeHour + ":" + eventStartTimeMinute;

    if (this.event.endTime != null){

      const [eventEndTimeHour, eventEndTimeMinute] = this.event.endTime.split(":").slice(0, -1);
      this.event.endTime =  eventEndTimeHour + ":" + eventEndTimeMinute;
    }

    const currentDateTime = new Date();
    const limitDateTime = new Date(this.event.limitDate);
    limitDateTime.setHours(parseInt(eventStartTimeHour, 10));
    limitDateTime.setMinutes(parseInt(eventStartTimeMinute, 10));

    console.log("aici Incepe");
    console.log(this.event.name);
    console.log("the current date time" + currentDateTime);
    console.log("the limit date" + limitDateTime)

    if (limitDateTime > currentDateTime) {
      this.possibleToResponde = true;
    } else {
      this.possibleToResponde = false;
    }
  }


  openInviteesDialog(status : string, users : InvitedUserModel[]) {
    this.dialog.open(InviteesListDialogComponent, {data:{users:users, type:status}})
  }

  //uses the userService to get the users invited to the current event
  //sorts these into 3 categories ==> 3 lists of users
  private getUsersRelatedToEvent(event: EventResponseModel) {
    console.log(event.id)
    this.userService.getAllInvitedUsersTo(event.id).subscribe( result =>
    {
      result.forEach( (invitee) =>
        {
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

  cancelEvent(eventType : string) {
    if (eventType == 'single') {
      let dialogResponse = this.dialog.open(ConfirmationDialogComponent,
        {data: "Are you sure you want to cancel your " + this.event.name + " event?"});
      dialogResponse.afterClosed().subscribe(result => {
        if (result) {
          this.deleteSingleEventEvent.emit(this.event)
        }
      });
    }
    else if (eventType == 'group') {
      let dialogResponse = this.dialog.open(ConfirmationDialogComponent, {
        data: "Are you sure you want to cancel event: "
          + this.event!.name + "?"
      });
      dialogResponse.afterClosed().subscribe(result => {
        if (result) {
          this.eventService.deleteGroupEvent(this.event.id).subscribe( next =>
            {
              this.deleteGroupEventEvent.emit();
              this.snackBar.open("Event "+ this.event.name + " canceled with success.", "Ok");
      
            }
      
          )
        }
      });
    }
    else if (eventType == 'past-group') {
      let dialogResponse = this.dialog.open(ConfirmationDialogComponent, {
        data: "Are you sure you want to delete event: "
          + this.event!.name + "?"
      });
      dialogResponse.afterClosed().subscribe(result => {
        if (result) {
          this.deletePastGroupEventEvent.emit(this.event)
        }
      });
    }
    else if (eventType == 'past-invite') {
      let dialogResponse = this.dialog.open(ConfirmationDialogComponent, {
        data: "Are you sure you want to delete event: "
          + this.event!.name + "?"
      });
      dialogResponse.afterClosed().subscribe(result => {
        if (result) {
          this.deletePastInviteEvent.emit(this.event)
        }
      });
    }
  }

  onAddNewInvitees(): void {
    const dialogRef = this.dialog.open(InviteAdditionalPopupComponent, {
      width: '400px',
      data: { id: this.event.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true){

        this.updateEventList.emit();

        this.snackBar.open('The chosen friends where invited to the event!', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  onUpdateSingleEventClick(): void {
    const dialogRef = this.dialog.open(AddSinglePopupComponent, {
      width: '400px',
      data: { id: this.event.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true){
       
        this.updateEventList.emit();
        this.snackBar.open('Your event was updated!', 'Close', {
          duration: 5000, 
        });
      }
    });
  }

  onUpdateCrearedGroupEventRemindersClick(): void {

    const dialogRef = this.dialog.open(AcceptInvitationAddReminderComponent, {
      width: '500px',
      data: { acceptInvitation: 0, event: this.event, relationToEvent: 1}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        
        this.updateRemindersForCreatedGroupEvent.emit();
        this.snackBar.open("The reminders for the event " + this.event.name + " where updated.", 'Close', {
          duration: 5000, 
        });
      }
    });
  }

  onUpdateInvitedToGroupEventRemindersClick(): void {

    const dialogRef = this.dialog.open(AcceptInvitationAddReminderComponent, {
      width: '500px',
      data: { acceptInvitation: 0, event: this.event, relationToEvent: 0}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        
        this.updateRemindersForInvitedToGroupEvent.emit();
        this.snackBar.open("The reminders for the event " + this.event.name + " where updated.", 'Close', {
          duration: 5000, 
        });
      }
    });
  }
}
