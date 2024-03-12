import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PhoneNumberConfirmatiomPopupComponent } from '../phone-number-confirmatiom-popup/phone-number-confirmatiom-popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserSearch } from '../shared/models/user-search.model';
import { LoggedUser } from '../shared/models/logged-user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})

export class PhoneNumberComponent implements OnInit {
  successfullyAdded: boolean =  false;
  phoneNumberForm: FormGroup;
  errorMessage: string;
  // inputErrorMessage: string;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {

    const loggedUser: LoggedUser = this.userService.getLoggedInUser();

    if (loggedUser.phoneNrConfirmation === '1'){

      this.userService.getUserById(loggedUser.id).subscribe(
        {
          next: (response: any) => {
          const userPhoneNumber = response.phoneNumber;
          this.phoneNumberForm.get('phoneNumber').setValue(userPhoneNumber);  
        },
        error: (error: HttpErrorResponse) => {
          // console.log(error);
        }
      }
      );
    }
    
    this.phoneNumberForm= new FormGroup({
      phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9+]+$/)])
      });

  }

  get inputErrorMessage(): string {
    const phoneNumberControl = this.phoneNumberForm.get('phoneNumber');

    if (phoneNumberControl.errors?.pattern) {
      return 'Only the "+" sign and numbers are allowed.';
    }
    else{
      if (phoneNumberControl.errors?.required) {
        return 'Phone number must be at least 10 characters long.';
      }
  
      if (phoneNumberControl.errors?.minlength) {
        return 'Phone number must be at least 10 characters long.';
      }
    }
  
    return '';
  }

  openConfirmationDialog(): void {

    
    this.userService.registerNumber(this.phoneNumberForm.get('phoneNumber').value).subscribe(
      {
        next: (response: any) => {
          this.errorMessage = null;

          this.successfullyAdded=  false;
          const dialogRef = this.dialog.open(PhoneNumberConfirmatiomPopupComponent, {
            width: '400px',
            data: { phoneNumber: this.phoneNumberForm.get('phoneNumber').value}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result === true){
                this.successfullyAdded = true;
            }
          });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    }
    );
  }
}
