import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InvitedUserModel} from "../shared/models/invited-user.model";
import {DialogRef} from "@angular/cdk/dialog";

@Component({
  selector: 'app-invitees-list-dialog',
  templateUrl: './invitees-list-dialog.component.html',
  styleUrls: ['./invitees-list-dialog.component.css']
})
export class InviteesListDialogComponent implements OnInit{
 users : InvitedUserModel[];

  constructor(  @Inject(MAT_DIALOG_DATA) public data: {users : InvitedUserModel[], type : string},
                public dialogRef: MatDialogRef<InviteesListDialogComponent>) {

    this.users = data.users;
  }

  ngOnInit(): void {
    // console.log(this.users)
  }

}
