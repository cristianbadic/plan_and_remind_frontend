import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ConfirmRegistration } from '../shared/models/confirm-registration.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm-register-popup',
  templateUrl: './confirm-register-popup.component.html',
  styleUrls: ['./confirm-register-popup.component.css']
})
export class ConfirmRegisterPopupComponent implements OnInit{

  confirmRegisterForm: FormGroup;
  errorMessage: string;
  emailSent: boolean;

  constructor(private router: Router, private dialogRef: MatDialogRef<ConfirmRegisterPopupComponent>,
    private snackBar: MatSnackBar, private userService: UserService) {}

  ngOnInit() {
    this.confirmRegisterForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    confirmationCode: new FormControl(null, [Validators.required, Validators.minLength(8)])

    });
  }

  confirmCode(): void {

    const emaildAndConfirmationCode: ConfirmRegistration = {

      email: this.confirmRegisterForm.get('email').value,
      accountConfirmation: this.confirmRegisterForm.get('confirmationCode').value
    }

    this.userService.confirmRegistration(emaildAndConfirmationCode).subscribe(
      {
        next: (response: any) => {
        // Close the dialog
        this.dialogRef.close();

        // Navigate to the 'auth' page
        this.router.navigate(['/auth']);

        // Show a snackbar message
        this.snackBar.open('Your registration is now finalized, you can now log in!', 'Close', {
          duration: 5000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.emailSent = null;
        this.errorMessage = error.error;
      }
    }
    );

    
  }

  resendEmail(): void {

    this.userService.resendEmail(this.confirmRegisterForm.get('email').value).subscribe(
      {
        next: (response: any) => {
          this.errorMessage = null;
          this.emailSent = true;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error;
      }
    }
    );
  }

}
