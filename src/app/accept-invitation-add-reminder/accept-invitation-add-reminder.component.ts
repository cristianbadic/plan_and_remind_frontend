import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';
import { LoggedUser } from '../shared/models/logged-user.model';
import { ReminderRequest } from '../shared/models/reminder-request.model';
import { EventResponseModel } from '../shared/models/event-response.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpErrorResponse } from '@angular/common/http';
import { InvitationService } from '../services/invitation.service';
import { FailedAcceptPopupComponent } from '../failed-accept-popup/failed-accept-popup.component';
import { EventAddRequest } from '../shared/models/event-add-request.model';

@Component({
  selector: 'app-accept-invitation-add-reminder',
  templateUrl: './accept-invitation-add-reminder.component.html',
  styleUrls: ['./accept-invitation-add-reminder.component.css']
})
export class AcceptInvitationAddReminderComponent {

  //month starts with 0
  public minDate:Date = new Date();
  addReminderForm: FormGroup;
  disabledAmountBefore: boolean = false;
  disabledSendToBefore: boolean = false;
  disabledTimeFormatBefore: boolean = false;

  confirmedPhoneNr: boolean = false;
  
  eventWhitoutReminderData: EventResponseModel;
  acceptInvitation: boolean = false;
  relationToEvent:number = -1;

  //for updating reminder cases
  eventToUpdateTheReminedrs: EventAddRequest;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AcceptInvitationAddReminderComponent>, private eventService: EventService,
    private dialog: MatDialog, private userService: UserService, private invitationService: InvitationService) {

 
      this.eventWhitoutReminderData = data.event;

      //1 if we need to get the reminders for a created event
      //0 if we need to get the reminders for an invited to event
      //-1 if we add reminders in this component for accepting an event
      this.relationToEvent = data.relationToEvent;

      if (data.acceptInvitation === 1){
        this.acceptInvitation = true;
        
      }
    }

  ngOnInit() {

    const loggedUser: LoggedUser = this.userService.getLoggedInUser();

    if (loggedUser.phoneNrConfirmation === '1'){
      this.confirmedPhoneNr =true;
    }

    this.minDate = new Date();

    this.initializeForm();

    if (this.relationToEvent === 1 || this.relationToEvent === 0) {
      this.initializeFormForUpdate();
    }
  
  }


  initializeFormForUpdate() {

    this.eventService.getGroupEventToEdit(this.eventWhitoutReminderData.id, this.relationToEvent).subscribe(
      {
        next: (response: EventAddRequest) =>  {
          this.eventToUpdateTheReminedrs = response;

          const defaultReminder: boolean = this.eventToUpdateTheReminedrs.defaultReminder === "true";

          let sendTo: string  = 'email';
          let timeFormat: string = 'hours';
          let amountBefore: string | number = '';
          let noAdditionalReminder = true;
    
          if (this.eventToUpdateTheReminedrs.sentTo !== "none" && this.eventToUpdateTheReminedrs.amountBefore !== -1){
    
            sendTo = this.eventToUpdateTheReminedrs.sentTo;
            timeFormat = this.eventToUpdateTheReminedrs.timeFormat;
            amountBefore = this.eventToUpdateTheReminedrs.amountBefore;
            noAdditionalReminder = false; 
          }
          else{
            this.disabledAmountBefore = true;
            this.disabledTimeFormatBefore = true;
          }

          if (this.eventToUpdateTheReminedrs.sentTo === "none" && defaultReminder === false){

            this.disabledSendToBefore = true;
          }
          else{
            sendTo = this.eventToUpdateTheReminedrs.sentTo;
          }
    
          this.addReminderForm.reset({
            defaultReminder: defaultReminder,
            
            sendTo: {value: sendTo, disabled: this.disabledSendToBefore},
            
            timeFormat: {value: timeFormat, disabled: this.disabledTimeFormatBefore},
            
            amountBefore: {value: amountBefore, disabled: this.disabledAmountBefore},
        
            noAdditionalReminder: noAdditionalReminder,
          });
          
          },
        
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });

  }
  
  initializeForm() {

    this.addReminderForm = new FormGroup({
      
      defaultReminder: new FormControl(false),
      
      //email, notification ...
      sendTo: new FormControl({value: 'email', disabled: this.disabledSendToBefore}, Validators.required),
      
      //minutes, hours, days
      timeFormat: new FormControl({value: 'minutes', disabled: this.disabledTimeFormatBefore}, Validators.required),
      
      amountBefore: new FormControl({value: '', disabled: this.disabledAmountBefore}, [Validators.required, Validators.pattern(/^\d+$/)]),
  
      noAdditionalReminder: new FormControl(false),
      },{ validators: [this.defaultReminderValidator.bind(this), this.additionalReminderValidator.bind(this)] }
    );

  }


   //to only have numbers in the input
   numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //to check if the additional reminder would be before current time
  additionalReminderValidator(control: AbstractControl): { [key: string]: boolean } | null{
    
    if (!this.eventWhitoutReminderData) {
      return null;
    }
    
    if (this.eventWhitoutReminderData === null || this.eventWhitoutReminderData === undefined){
      return null;
    }

    const eventDate = this.eventWhitoutReminderData.eventDate;
    const startTime = this.eventWhitoutReminderData.startTime;
    const amountBefore = control.get('amountBefore').value;
    const timeFormat = control.get('timeFormat').value;
    const noAdditionalReminder = control.get('noAdditionalReminder').value;

    const isSendToDisabled: boolean = control.get('sendTo').enabled;

    
    if (eventDate === null || startTime === null || amountBefore === null || timeFormat === null) {
      return null;
    }

  
    if (noAdditionalReminder !== true){
        const currentDateTime = new Date();
        const selectedDateTime = new Date(eventDate);
        const selectedTimeParts = startTime.split(':');
        selectedDateTime.setHours(parseInt(selectedTimeParts[0], 10));
        selectedDateTime.setMinutes(parseInt(selectedTimeParts[1], 10));

        if (timeFormat == 'minutes'){
          selectedDateTime.setMinutes(selectedDateTime.getMinutes() - amountBefore);
        }

        if (timeFormat == 'days'){
          selectedDateTime.setDate(selectedDateTime.getDate() - amountBefore);
        }

        if (timeFormat == 'hours'){
          selectedDateTime.setHours(selectedDateTime.getHours() - amountBefore);
        }
        console.log("the past time is: "+ selectedDateTime)

      // Check if the selected datetime is after the current datetime
      if (selectedDateTime > currentDateTime) {
        return null; // Validation passed
      } else {
        return { additionalInvalid: true }; // Validation failed
      }
    }

  return null;
    
  }

  //to check if the default reminder would be before current time
  defaultReminderValidator(control: AbstractControl): { [key: string]: boolean } | null{

    if (!this.eventWhitoutReminderData) {
      return null;
    }
    
    if (this.eventWhitoutReminderData === undefined ||  this.eventWhitoutReminderData === null){
      return null;
    }

    const eventDate = this.eventWhitoutReminderData.eventDate;
    const startTime = this.eventWhitoutReminderData.startTime;
    const defaultReminder = control.get('defaultReminder').value;

    
    if (eventDate === null || startTime === null || defaultReminder === null) {
      return null;
    }

  
    if (defaultReminder === true){
        const currentDateTime = new Date();
        const selectedDateTime = new Date(eventDate);
        const selectedTimeParts = startTime.split(':');
        selectedDateTime.setHours(parseInt(selectedTimeParts[0], 10));
        selectedDateTime.setMinutes(parseInt(selectedTimeParts[1], 10));
        selectedDateTime.setMinutes(selectedDateTime.getMinutes() - 30);

    // Check if the selected datetime is after the current datetime
    if (selectedDateTime > currentDateTime) {
      return null; // Validation passed
    } else {
      return { defaultInvalid: true }; // Validation failed
    }
  }

  return null;
    
  }
  
  onDefaultReminderChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.addReminderForm.controls['sendTo'].enable();
    } else {
      if (this.addReminderForm.get('noAdditionalReminder').value === true){
        this.addReminderForm.controls['sendTo'].disable();
      }
    }
  }

  onAdditionalChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.addReminderForm.get('defaultReminder').value !== true){
        this.addReminderForm.controls['sendTo'].disable();
      }
      this.addReminderForm.controls['amountBefore'].disable();
      this.addReminderForm.controls['timeFormat'].disable();
    } else {
      this.addReminderForm.controls['amountBefore'].enable();
      this.addReminderForm.controls['timeFormat'].enable();
      this.addReminderForm.controls['sendTo'].enable();
    }
  }
  
  onSubmit(){

    if (this.addReminderForm.valid) {

      //values that need to be transformed before the call to the backend
      
      let defaultReminderAfterFormInput = "";
      let sendTo = "";
      let amountBefore = this.addReminderForm.get('amountBefore').value;

      if (this.addReminderForm.get('defaultReminder').value === true){
        defaultReminderAfterFormInput = "true";
      }
      else {
        defaultReminderAfterFormInput = "false";
      }
      
      //if the checkbox for no additional reminder is checked we send "none" back for sendTo
      if (this.addReminderForm.get('noAdditionalReminder').value 
            && this.addReminderForm.get('defaultReminder').value === false){
        sendTo = "none";
      }
      else {
        sendTo = this.addReminderForm.get('sendTo').value;
      }

      //to check on the backend
      if (this.addReminderForm.get('noAdditionalReminder').value){
        amountBefore = -1;
      } 

      if (this.relationToEvent === 1 || this.relationToEvent === 0){

        const updateRemindersModel: ReminderRequest = {
          defaultReminder: defaultReminderAfterFormInput,
          sentTo: sendTo,
          timeFormat: this.addReminderForm.get('timeFormat').value,
          amountBefore: amountBefore,
        }

        if (this.relationToEvent === 1 ){

          this.eventService.updateGroupEventCreatedReminders(this.eventWhitoutReminderData.id, updateRemindersModel).subscribe(
            {
              next: (response: any) => {
  
                this.dialogRef.close(true);
              },
              
              error: (error: HttpErrorResponse) =>   alert(error.message)
            });
        }
        else{

          this.eventService.updateGroupEventInvitedReminders(this.eventWhitoutReminderData.id, updateRemindersModel).subscribe(
            {
              next: (response: any) => {
  
                this.dialogRef.close(true);
              },
              
              error: (error: HttpErrorResponse) =>   alert(error.message)
            });

        }

      }

      //if on this submit we accept an invitation
      if(this.acceptInvitation){

        const currentDateTime = new Date();
        const limitDateTime = new Date(this.eventWhitoutReminderData.limitDate);
        const selectedTimeParts = this.eventWhitoutReminderData.startTime.split(':');

        limitDateTime.setHours(parseInt(selectedTimeParts[0], 10));
        limitDateTime.setMinutes(parseInt(selectedTimeParts[1], 10));

        //if limit date before current time we can accept the invitation
        if (limitDateTime > currentDateTime) {
          const acceptEventModel: ReminderRequest = {
            defaultReminder: defaultReminderAfterFormInput,
            sentTo: sendTo,
            timeFormat: this.addReminderForm.get('timeFormat').value,
            amountBefore: amountBefore,
          }
  
          this.invitationService.acceptInvitation(this.eventWhitoutReminderData.id, acceptEventModel).subscribe(
            {
              next: (response: any) => {
  
                this.dialogRef.close(true);
              },
              
              error: (error: HttpErrorResponse) =>   alert(error.message)
            });
        } else {

          const dialogRefForCheckPopup = this.dialog.open(FailedAcceptPopupComponent, {
            width: '500px',
            data: { event: this.eventWhitoutReminderData }
          });

          dialogRefForCheckPopup.afterClosed().subscribe(result => {

            this.dialogRef.close(false);

          });
        }


      }
    }
  
  }

  closeDialog(){
    this.dialogRef.close(false);
    // this.dialog.closeAll();
  }
}
