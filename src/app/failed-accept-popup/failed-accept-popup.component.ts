import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventAddRequest } from '../shared/models/event-add-request.model';

@Component({
  selector: 'app-failed-accept-popup',
  templateUrl: './failed-accept-popup.component.html',
  styleUrls: ['./failed-accept-popup.component.css']
})
export class FailedAcceptPopupComponent implements OnInit{

  canNotAcceptEvent: EventAddRequest;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private dialogRef: MatDialogRef<FailedAcceptPopupComponent>,
  private dialog: MatDialog) {

    this.canNotAcceptEvent = data.event;
    
  }

  ngOnInit() {
    
  }

closeDialog(){
  this.dialogRef.close();
  //this.dialog.closeAll();
}

}
