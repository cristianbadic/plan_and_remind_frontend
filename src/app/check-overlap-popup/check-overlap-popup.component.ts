import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { EventAddRequest } from '../shared/models/event-add-request.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-check-overlap-popup',
  templateUrl: './check-overlap-popup.component.html',
  styleUrls: ['./check-overlap-popup.component.css']
})
export class CheckOverlapPopupComponent implements OnInit{
  
  overlappingEvents: OverlapResponse[] = [];
  toAddEvent: EventAddRequest;
  wasAdded: boolean = true;
  eventToUpdateId: number;
  isUpdateEvent: boolean;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private dialogRef: MatDialogRef<CheckOverlapPopupComponent>,
  private dialog: MatDialog, private eventService: EventService) {

    console.log(data.event); 
    console.log(data.overlappingEvents); 

    this.overlappingEvents = data.overlappingEvents;
    this.toAddEvent = data.event;
    this.eventToUpdateId = data.eventId;

    this.isUpdateEvent = this.eventToUpdateId !== -1;
  }

  ngOnInit() {
    
  }

  addOrUpdateTheEvent(): void {

    if (this.eventToUpdateId === -1){
    this.eventService.addEvent(this.toAddEvent).subscribe(
      {
        next: (response: any) => {
          console.log(response);
        },
        
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });

    this.dialogRef.close(this.wasAdded);
  }
  else{
    this.eventService.updateSingleEvent(this.toAddEvent, this.eventToUpdateId).subscribe(
      {
        next: (response: any) => {
          console.log(response);
        },
        
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });

    this.dialogRef.close(this.wasAdded);
  }
}

closeDialog(){
  this.dialogRef.close();
}

}
