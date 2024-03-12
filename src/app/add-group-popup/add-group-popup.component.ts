import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventAddRequest } from '../shared/models/event-add-request.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../services/event.service';
import { DatePipe } from '@angular/common';
import { OverlapResponse } from '../shared/models/overlap-response.model';
import { CheckOverlapPopupComponent } from '../check-overlap-popup/check-overlap-popup.component';
import { CheckOverlapRequest } from '../shared/models/check-overlap-request.model';
import { UserSearch } from '../shared/models/user-search.model';
import { UserService } from '../services/user.service';
import { LoggedUser } from '../shared/models/logged-user.model';

@Component({
  selector: 'app-add-group-popup',
  templateUrl: './add-group-popup.component.html',
  styleUrls: ['./add-group-popup.component.css']
})
export class AddGroupPopupComponent implements OnInit{
   //month starts with 0
   public minDate:Date = new Date();
   addGroupEventForm: FormGroup;
   disabledAmountBefore: boolean = false;
   overlappingEvents: OverlapResponse[] = [];
   wasAdded:boolean = true;
   public friends: UserSearch[] = [];
   eventIdForUpdate: number = -1;


   confirmedPhoneNr: boolean = false;
 
   constructor(private dialogRef: MatDialogRef<AddGroupPopupComponent>, private eventService: EventService,
     private datePipe: DatePipe, private dialog: MatDialog, private userService: UserService) {}
 
   ngOnInit() {

    const loggedUser: LoggedUser = this.userService.getLoggedInUser();

    if (loggedUser.phoneNrConfirmation === '1'){
      this.confirmedPhoneNr =true;
    }
    
    //method to get all friends
    this.getFriends();

     this.minDate = new Date();
     this.addGroupEventForm = new FormGroup({
     name: new FormControl(null, Validators.required),
     description: new FormControl(null),
     eventDate: new FormControl(null, Validators.required),
     startTime: new FormControl(null, Validators.required),
     endTime: new FormControl(null),
     
     defaultReminder: new FormControl(false),
     
     //email, notification, both, none
     sendTo: new FormControl('email', Validators.required),
     
     //minutes, hours, days
     timeFormat: new FormControl('minutes', Validators.required),
     
     amountBefore: new FormControl({value: '', disabled: this.disabledAmountBefore}, [Validators.required, Validators.pattern(/^\d+$/)]),
 
     noAdditionalReminder: new FormControl(false),

     invitees: new FormControl([]),

     limitDays: new FormControl(0, Validators.required),
     
   },
   { validators: [this.timeValidator, this.dateAndTimeValidator, this.eventDateValidator, this.defaultReminderValidator,
    this.additionalReminderValidator] }
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
 
   private getFriends(): void {
    this.userService.getAllFriendsCurrentUser().subscribe(
      {
        next: (response: UserSearch[]) =>  {
          this.friends = response;
          },
      
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });
  }

  onInviteeRemoved(friend: UserSearch) {
    const chosenFriends = this.addGroupEventForm.get('invitees').value;
    this.removeFirst(chosenFriends, friend);
    this.addGroupEventForm.get('invitees').setValue(chosenFriends); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {

    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
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
        selectedDateTime.setDate(selectedDateTime.getDate() - 1);

    // Check if the selected datetime is after the current datetime
    if (selectedDateTime > currentDateTime) {
      return null; // Validation passed
    } else {
      return { defaultInvalid: true }; // Validation failed
    }
  }

  return null;
    
  }

  //so that the reminder limit won't be before the current time
  eventDateValidator(control: AbstractControl): { [key: string]: boolean } | null{
    const eventDate = control.get('eventDate').value;
    const limitDays = control.get('limitDays').value;

    const startTimeValue = control.get('startTime').value;
    
    if (eventDate === null || limitDays === null || startTimeValue === null) {
      return null;
    }
  
    if (eventDate && limitDays && startTimeValue) {

      const selectedTimeParts = startTimeValue.split(':');
      eventDate.setHours(parseInt(selectedTimeParts[0], 10));
      eventDate.setMinutes(parseInt(selectedTimeParts[1], 10));
      const today = new Date();
      const eventDateWithLimit = new Date(eventDate);
      eventDateWithLimit.setDate(eventDateWithLimit.getDate() - limitDays);
  
      if (eventDateWithLimit < today) {
        return { invalidDate: true };
      }
    }
  
    return null;
  };

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
 
 
   //depending if checkbox checked some fileds can be disabled
   onDefaultReminderChange(event: MatCheckboxChange) {
     if (event.checked) {
       this.addGroupEventForm.controls['sendTo'].enable();
     } else {
       if (this.addGroupEventForm.get('noAdditionalReminder').value === true){
         this.addGroupEventForm.controls['sendTo'].disable();
       }
     }
   }
 
   onAdditionalChange(event: MatCheckboxChange) {
     if (event.checked) {
       if (this.addGroupEventForm.get('defaultReminder').value !== true){
         this.addGroupEventForm.controls['sendTo'].disable();
       }
       this.addGroupEventForm.controls['amountBefore'].disable();
       this.addGroupEventForm.controls['timeFormat'].disable();
     } else {
       this.addGroupEventForm.controls['amountBefore'].enable();
       this.addGroupEventForm.controls['timeFormat'].enable();
       this.addGroupEventForm.controls['sendTo'].enable();
     }
   }
   
   onSubmit(){
 
     if (this.addGroupEventForm.valid) {
      //  console.log('Name:', this.addGroupEventForm.get('name').value);
      //  console.log('Description:', this.addGroupEventForm.get('description').value);
      //  console.log('Event Date:', this.addGroupEventForm.get('eventDate').value);
      //  console.log('Start Time:', this.addGroupEventForm.get('startTime').value);
      //  console.log('End Time:', this.addGroupEventForm.get('endTime').value);
      //  console.log('Default Reminder:', this.addGroupEventForm.get('defaultReminder').value);
      //  console.log('Send To:', this.addGroupEventForm.get('sendTo').value);
      //  console.log('Time Format:', this.addGroupEventForm.get('timeFormat').value);
      //  console.log('Amount Before:', this.addGroupEventForm.get('amountBefore').value);
      //  console.log('No Additional Reminder:', this.addGroupEventForm.get('noAdditionalReminder').value);
      //  console.log('Invited to List:', this.addGroupEventForm.get('invitees').value);
 
 
       //values that need to be transformed before the call to the backend
       const modifiedEventDate = this.datePipe.transform(this.addGroupEventForm.get('eventDate').value, 'yyyy-MM-dd');
       let defaultReminderAfterFormInput = "";
       let sendTo = "";
       let amountBefore = this.addGroupEventForm.get('amountBefore').value;
 
       if (this.addGroupEventForm.get('defaultReminder').value === true){
         defaultReminderAfterFormInput = "true";
       }
       else {
         defaultReminderAfterFormInput = "false";
       }
       
       //if the checkbox for no additional reminder is checked we send "none" back for sendTo
       if (this.addGroupEventForm.get('noAdditionalReminder').value  
            && this.addGroupEventForm.get('defaultReminder').value === false){
         sendTo = "none";
       }
       else {
         sendTo = this.addGroupEventForm.get('sendTo').value;
       }

       if (this.addGroupEventForm.get('noAdditionalReminder').value){
        amountBefore = -1;
      } 

       //create a list of inviteeIDs
       const inviteeIDs: number[] = this.addGroupEventForm.get('invitees').value.map(invitee => invitee.userEntity.id);
       

       const limitDate = new Date(this.addGroupEventForm.get('eventDate').value);
       limitDate.setDate(limitDate.getDate() - this.addGroupEventForm.get('limitDays').value);

       const modifiedLimitDate = this.datePipe.transform(limitDate, 'yyyy-MM-dd');
     
       
       const event: EventAddRequest = {
         name: this.addGroupEventForm.get('name').value,
         eventType: 'group',
         description: this.addGroupEventForm.get('description').value,
         eventDate: modifiedEventDate,
         startTime: this.addGroupEventForm.get('startTime').value,
         endTime: this.addGroupEventForm.get('endTime').value,
         limitDate: modifiedLimitDate,
         creatorId: 0,
         defaultReminder: defaultReminderAfterFormInput,
         sentTo: sendTo,
         timeFormat: this.addGroupEventForm.get('timeFormat').value,
         amountBefore: amountBefore,
         inviteeIDs: inviteeIDs
       };
 
      //  console.log('this is the actual event');
      //  console.log(event);
 
       const checkOverlap: CheckOverlapRequest = {
         eventDate: modifiedEventDate,
         startTime: this.addGroupEventForm.get('startTime').value,
         endTime: this.addGroupEventForm.get('endTime').value,
       }
 
      //  console.log('The object passed to check overlap is:')
      //  console.log(checkOverlap);
 
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
                     console.log(response);
                     this.dialogRef.close(this.wasAdded);
                   },
                   
                   error: (error: HttpErrorResponse) =>  alert(error.message)
                 });
         
                 
             }
           },
           
           error: (error: HttpErrorResponse) =>  alert(error.message)
       });
       
       
     }  
   }
 
   closeDialog(){
     this.dialogRef.close();
    //  this.dialog.closeAll();
  }

}
