import { Component } from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {EventService} from "../services/event.service";
import {EventResponseModel} from "../shared/models/event-response.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InvitationService} from "../services/invitation.service";
import { MatDialog } from '@angular/material/dialog';
import { AddSinglePopupComponent } from '../add-single-popup/add-single-popup.component';
import { AddGroupPopupComponent } from '../add-group-popup/add-group-popup.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  upcomingEventsInvites: EventResponseModel[] = [];
  upcomingEvents : EventResponseModel[] = [];
  pastEvents : EventResponseModel[] = [];
  constructor(private eventService:EventService,
              private invitationService : InvitationService,
              private snackBar : MatSnackBar,
              private dialog: MatDialog) {
    this.getAllUpcomingInvitations()
  }

  onEventTabChange($event: MatTabChangeEvent) {
    console.log($event);
    if ($event.index == 0) {
      this.getAllUpcomingInvitations()
    }
    else if($event.index == 1){
      this.getAllUpcomingEvents()
    }
    else if($event.index == 2){
      this.getAllPastEvents()
    }
  }

  getAllUpcomingInvitations() {
    this.eventService.getAllUpcomingInvitations().subscribe(
      result =>
      {

        this.upcomingEventsInvites = result;
      }
    )
  }

  getAllUpcomingEvents() {
    this.eventService.getAllUpcomingEvents().subscribe(
      result =>
      {
        this.upcomingEvents = result;
      }
    )
  }

  getAllPastEvents() {
    this.eventService.getAllPastEvents().subscribe(
      result =>
      {
        this.pastEvents = result;
      }
    )
  }

  deleteSingleEvent($event: EventResponseModel) {
    this.eventService.deleteSingleEvent($event.id).subscribe( next =>
      {
        this.getAllUpcomingEvents()
        this.getAllPastEvents()
        this.snackBar.open("Event "+ $event.name + " canceled with success.", "Ok");
      }

    )
  }

  deleteGroupEvent() {

    this.getAllUpcomingEvents()
  }

  deletePastGroupEvent($event: EventResponseModel) {
    console.log("past event")
    this.eventService.deletePastGroupEvent($event.id).subscribe( next =>
      {
        this.getAllPastEvents()
        this.getAllUpcomingEvents()
        this.snackBar.open("Event "+ $event.name + " deleted with success.", "Ok");
      }
    )
  }
  deletePastInvite($event: EventResponseModel) {
    console.log($event)
    this.eventService.deletePastInvite($event.id).subscribe( next =>
      {
        this.getAllPastEvents()
        this.snackBar.open("Event "+ $event.name + " deleted with success.", "Ok");
      }
    )
  }


  declineInvitation($event: EventResponseModel) {
    this.invitationService.declineInvitation($event.id).subscribe( next => {
        this.snackBar.open("You have declined the invitation to the " + $event.name + " event.", "Ok")
        this.getAllUpcomingInvitations();
      }
      )
  }

  onCreateSingleEventClick(): void {
    const dialogRef = this.dialog.open(AddSinglePopupComponent, {
      width: '400px',
      data: { id: -1 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.getAllUpcomingEvents()
        this.snackBar.open('You added a new single event, check "Upcoming Events" to see it!', 'Close', {
          duration: 5000, // Set the duration for which the snackbar is displayed (in milliseconds)
        });
      }
    });
  }

  onCreateGroupEventClick(): void {
    const dialogRef = this.dialog.open(AddGroupPopupComponent, {
      // width: '70%',
      // height: '50%'
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true){
        this.getAllUpcomingEvents()
        this.snackBar.open('You added a new group event, check "Upcoming Events" to see it!', 'Close', {
          duration: 5000,
        });
      }
    });
  }

  updateListOfEvents(): void{
    this.getAllUpcomingEvents();
  }

  acceptInvitationToEvent(): void{
    this.getAllUpcomingInvitations();
  }

  updatedCreatedGroupEvent(): void{
    this.getAllUpcomingEvents();
  }

  updatedInvitedToGroupEvent(): void{
    this.getAllUpcomingEvents();
  }
}
