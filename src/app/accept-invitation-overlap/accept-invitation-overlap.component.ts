import { Component, Inject, OnInit } from '@angular/core';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventResponseModel } from '../shared/models/event-response.model';
import { AcceptInvitationAddReminderComponent } from '../accept-invitation-add-reminder/accept-invitation-add-reminder.component';

@Component({
  selector: 'app-accept-invitation-overlap',
  templateUrl: './accept-invitation-overlap.component.html',
  styleUrls: ['./accept-invitation-overlap.component.css']
})
export class AcceptInvitationOverlapComponent implements OnInit{

  overlappingEvents: OverlapResponse[] = [];
  eventToBeAccepted: EventResponseModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private dialogRef: MatDialogRef<AcceptInvitationOverlapComponent>,
  private dialog: MatDialog) {

    this.overlappingEvents = data.overlappingEvents;
    this.eventToBeAccepted = data.event;

  }

  ngOnInit() {
    
  }

  acceptInvitation(): void {

    const dialogRefForCheckPopup = this.dialog.open(AcceptInvitationAddReminderComponent, {
      width: '500px',
      data: { acceptInvitation: 1, event: this.eventToBeAccepted, relationToEvent: -1}
    });

    dialogRefForCheckPopup.afterClosed().subscribe(result => {
      if (result === true) {
        this.dialogRef.close(true);
      }
    });

}

closeDialog(){
  this.dialogRef.close(false);
}


}
