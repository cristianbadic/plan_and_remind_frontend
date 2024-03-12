import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-phone-number-confirmatiom-popup',
  templateUrl: './phone-number-confirmatiom-popup.component.html',
  styleUrls: ['./phone-number-confirmatiom-popup.component.css']
})
export class PhoneNumberConfirmatiomPopupComponent {

  confirmPhoneNrForm: FormGroup;
  errorMessage: string;
  smsSent: boolean;

  phoneNumber: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private dialogRef: MatDialogRef<PhoneNumberConfirmatiomPopupComponent>,
    private userService: UserService) {

      this.phoneNumber = data.phoneNumber;
    }

  ngOnInit() {

    this.confirmPhoneNrForm = new FormGroup({
    confirmationCode: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  confirmCode(): void {

    this.userService.confirmPhoneNr(this.confirmPhoneNrForm.get('confirmationCode').value).subscribe(
      {
        next: (response: any) => {
        // so we put 1 in the local storage so now the user has the sms option
        this.userService.updatePhoneNrConfirmationStatus();
        this.dialogRef.close(true);
        
      },
      error: (error: HttpErrorResponse) => {
        this.smsSent = null;
        this.errorMessage = error.error;
      }
    }
    );

    
  }

  resendSms(): void {

    this.userService.resendConfirmationSms(this.phoneNumber).subscribe(
      {
        next: (response: any) => {
          this.errorMessage = null;
          this.smsSent = true;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    }
    );
  }

}
