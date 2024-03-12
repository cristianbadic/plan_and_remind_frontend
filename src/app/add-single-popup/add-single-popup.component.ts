import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../services/event.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EventAddRequest } from '../shared/models/event-add-request.model';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CheckOverlapRequest } from '../shared/models/check-overlap-request.model';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { CheckOverlapPopupComponent } from '../check-overlap-popup/check-overlap-popup.component';
import { LoggedUser } from '../shared/models/logged-user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-single-popup',
  templateUrl: './add-single-popup.component.html',
  styleUrls: ['./add-single-popup.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class AddSinglePopupComponent implements OnInit{

  public minDate:Date = new Date();
  addSimpleEventForm: FormGroup;
  disabledAmountBefore: boolean = false;
  disabledSendToBefore: boolean = false;
  disabledTimeFormatBefore: boolean = false;
  overlappingEvents: OverlapResponse[] = [];
  wasAdded:boolean = true;
  eventIdForUpdate: number;

  //for the update case
  eventToUpdate: EventAddRequest;

  confirmedPhoneNr: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddSinglePopupComponent>, private eventService: EventService,
    private datePipe: DatePipe, private dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder,) {

      this.eventIdForUpdate = data.id;
    }

  ngOnInit() {

    const loggedUser: LoggedUser = this.userService.getLoggedInUser();

    if (loggedUser.phoneNrConfirmation === '1'){
      this.confirmedPhoneNr =true;
    }

    this.minDate = new Date();

    this.initializeFormForAdd();

    if (this.eventIdForUpdate !== -1) {
      this.initializeFormForUpdate();
    }
  
  }


  initializeFormForUpdate() {

    this.eventService.getEventToEdit(this.eventIdForUpdate).subscribe(
      {
        next: (response: EventAddRequest) =>  {
          this.eventToUpdate = response;

          const defaultReminder: boolean = this.eventToUpdate.defaultReminder === "true";

          const startTimeWithoutSeconds = this.eventToUpdate.startTime.split(":").slice(0, 2).join(":");

          let endTimeWithoutSeconds = null;

          if (this.eventToUpdate.endTime !== null){

            endTimeWithoutSeconds = this.eventToUpdate.endTime.split(":").slice(0, 2).join(":");
          }

          let sendTo: string  = 'email';
          let timeFormat: string = 'hours';
          let amountBefore: string | number = '';
          let noAdditionalReminder = true;
    
          if (this.eventToUpdate.sentTo !== "none" && this.eventToUpdate.amountBefore !== -1){
    
            sendTo = this.eventToUpdate.sentTo;
            timeFormat = this.eventToUpdate.timeFormat;
            amountBefore = this.eventToUpdate.amountBefore;
            noAdditionalReminder = false; 
          }
          else{
            this.disabledAmountBefore = true;
            this.disabledTimeFormatBefore = true;
          }

          if (this.eventToUpdate.sentTo === "none" && defaultReminder === false){

            this.disabledSendToBefore = true;
          }
          else{
            sendTo = this.eventToUpdate.sentTo;
          }
    
          this.addSimpleEventForm.reset({
            name: this.eventToUpdate.name,
            description: this.eventToUpdate.description,
            eventDate: this.eventToUpdate.eventDate,
            startTime: startTimeWithoutSeconds,
            endTime: endTimeWithoutSeconds,
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
  
  initializeFormForAdd() {

    this.addSimpleEventForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      eventDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      endTime: new FormControl(null),
      
      defaultReminder: new FormControl(false),
      
      //email, notification, both, none
      sendTo: new FormControl({value: 'email', disabled: this.disabledSendToBefore}, Validators.required),
      
      //minutes, hours, days
      timeFormat: new FormControl({value: 'minutes', disabled: this.disabledTimeFormatBefore}, Validators.required),
      
      amountBefore: new FormControl({value: '', disabled: this.disabledAmountBefore}, [Validators.required, Validators.pattern(/^\d+$/)]),
  
      noAdditionalReminder: new FormControl(false),
      },{ validators: [this.timeValidator, this.dateAndTimeValidator, this.defaultReminderValidator, this.additionalReminderValidator] }
    );

  }


   //to only have numbers in the imput
   numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //check additional reminder
  //to check if the default reminder would be before current time
  additionalReminderValidator(control: AbstractControl): { [key: string]: boolean } | null{
    const eventDate = control.get('eventDate').value;
    const startTime = control.get('startTime').value;
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
    const eventDate = control.get('eventDate').value;
    const startTime = control.get('startTime').value;
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
  
  timeValidator(control: AbstractControl): { [key: string]: boolean } | null {

    const startTimeValue = control.get('startTime').value;
    const endTimeValue = control.get('endTime').value;

    if (startTimeValue === null || endTimeValue === null) {
      return null;
    }

    if (startTimeValue && endTimeValue && startTimeValue <= endTimeValue) {
      return null;
    }

  return { timeRangeInvalid: true }; 
  }

  dateAndTimeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const eventDateValue = control.get('eventDate').value;
    const startTimeValue = control.get('startTime').value;
  
    if (eventDateValue === null || startTimeValue === null) {
      return null;
    }
  
    const currentDateTime = new Date();
    const selectedDateTime = new Date(eventDateValue);
    const selectedTimeParts = startTimeValue.split(':');
    selectedDateTime.setHours(parseInt(selectedTimeParts[0], 10));
    selectedDateTime.setMinutes(parseInt(selectedTimeParts[1], 10));

    // Check if the selected datetime is after the current datetime
    if (selectedDateTime > currentDateTime) {
      return null; // Validation passed
    } else {
      return { dateTimeInvalid: true }; // Validation failed
    }
  }

  
  onDefaultReminderChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.addSimpleEventForm.controls['sendTo'].enable();
    } else {
      if (this.addSimpleEventForm.get('noAdditionalReminder').value === true){
        this.addSimpleEventForm.controls['sendTo'].disable();
      }
    }
  }

  onAdditionalChange(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.addSimpleEventForm.get('defaultReminder').value !== true){
        this.addSimpleEventForm.controls['sendTo'].disable();
      }
      this.addSimpleEventForm.controls['amountBefore'].disable();
      this.addSimpleEventForm.controls['timeFormat'].disable();
    } else {
      this.addSimpleEventForm.controls['amountBefore'].enable();
      this.addSimpleEventForm.controls['timeFormat'].enable();
      this.addSimpleEventForm.controls['sendTo'].enable();
    }
  }
  
  onSubmit(){

    if (this.addSimpleEventForm.valid) {

      //values that need to be transformed before the call to the backend
      const modifiedEventDate = this.datePipe.transform(this.addSimpleEventForm.get('eventDate').value, 'yyyy-MM-dd');
      let defaultReminderAfterFormInput = "";
      let sendTo = "";
      let amountBefore = this.addSimpleEventForm.get('amountBefore').value;

      if (this.addSimpleEventForm.get('defaultReminder').value === true){
        defaultReminderAfterFormInput = "true";
      }
      else {
        defaultReminderAfterFormInput = "false";
      }
      
      //if the checkbox for no additional reminder is checked we send "none" back for sendTo
      if (this.addSimpleEventForm.get('noAdditionalReminder').value 
            && this.addSimpleEventForm.get('defaultReminder').value === false){
        sendTo = "none";
      }
      else {
        sendTo = this.addSimpleEventForm.get('sendTo').value;
      }

      if (this.addSimpleEventForm.get('noAdditionalReminder').value){
        amountBefore = -1;
      } 

      
      const event: EventAddRequest = {
        name: this.addSimpleEventForm.get('name').value,
        eventType: 'single',
        description: this.addSimpleEventForm.get('description').value,
        eventDate: modifiedEventDate,
        startTime: this.addSimpleEventForm.get('startTime').value,
        endTime: this.addSimpleEventForm.get('endTime').value,
        creatorId: 0,
        defaultReminder: defaultReminderAfterFormInput,
        sentTo: sendTo,
        timeFormat: this.addSimpleEventForm.get('timeFormat').value,
        amountBefore: amountBefore,
        inviteeIDs: []
      };

      // console.log('this is the actual event');
      // console.log(event);

      const checkOverlap: CheckOverlapRequest = {
        eventDate: modifiedEventDate,
        startTime: this.addSimpleEventForm.get('startTime').value,
        endTime: this.addSimpleEventForm.get('endTime').value,
      }

      // console.log('The object passed to check overlap is:')
      // console.log(checkOverlap);

      //if it is -1 it means that we are adding instead of updating
      if (this.eventIdForUpdate === -1){

         //check overlap call to the backend
        this.eventService.checkOverlapWithOtherEvents(checkOverlap).subscribe(
          {
            next: (response: OverlapResponse[]) =>  {
              this.overlappingEvents = response;

              //if there are overlappingEvents, we need to open the check-overlap popup
              if (this.overlappingEvents.length > 0) {

                const dialogRefForCheckPopup = this.dialog.open(CheckOverlapPopupComponent, {
                  width: '500px',
                  data: { event, overlappingEvents: this.overlappingEvents, eventId: this.eventIdForUpdate }
                });

                dialogRefForCheckPopup.afterClosed().subscribe(result => {
                  if (result === true) {
                    this.dialogRef.close(this.wasAdded)
                  }
                });

              } else {
                this.eventService.addEvent(event).subscribe(
                  {
                    next: (response: any) => {
                    },
                    
                    //vad mai incolo ce fac in legatura cu caz de eroare
                    error: (error: HttpErrorResponse) =>  alert(error.message)
                  });
          
                  this.dialogRef.close(this.wasAdded);
              }
            },
            //vad mai incolo ce fac in legatura cu caz de eroare
            error: (error: HttpErrorResponse) =>  alert(error.message)
        });
      }
      else{
        
         //check overlap call to the backend
         this.eventService.checkOverlapWithOtherEventsForUpdates(checkOverlap, this.eventIdForUpdate).subscribe(
          {
            next: (response: OverlapResponse[]) =>  {
              this.overlappingEvents = response;

              //if there are overlappingEvents, we need to open the check-overlap popup
              if (this.overlappingEvents.length > 0) {

                const dialogRefForCheckPopup = this.dialog.open(CheckOverlapPopupComponent, {
                  width: '500px',
                  data: { event, overlappingEvents: this.overlappingEvents, eventId: this.eventIdForUpdate }
                });

                dialogRefForCheckPopup.afterClosed().subscribe(result => {
                  if (result === true) {
                    this.dialogRef.close(this.wasAdded)
                  }
                });

              } else {
                this.eventService.updateSingleEvent(event, this.eventIdForUpdate).subscribe(
                  {
                    next: (response: any) => {
                    },
                    
                    
                    error: (error: HttpErrorResponse) =>  alert(error.message)
                  });
          
                  this.dialogRef.close(this.wasAdded);
              }
            },
            
            error: (error: HttpErrorResponse) =>  alert(error.message)
        });
      } 
    }
  
  }

  closeDialog(){
    this.dialogRef.close();
    this.dialog.closeAll();
  }

}
