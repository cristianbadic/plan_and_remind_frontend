import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggedUser } from '../shared/models/logged-user.model';
import { UserResponse } from '../shared/models/user-response.model';
import { UpdateUserModel } from '../shared/models/update-user-request.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  public validationError: string;
  hide: boolean = true;
  hideForNew: boolean = true;
  currentUserWithDetails: UserResponse;

  public maxDate:Date = new Date(2018, 11, 31);

  constructor(private userService: UserService, private datePipe: DatePipe, private snackBar: MatSnackBar) {}


  ngOnInit() {

    this.profileForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      birthDate: new FormControl(null, Validators.required),
      currentPassword: new FormControl(null, [Validators.minLength(6)]),
      newPassword: new FormControl('', [Validators.minLength(6)]),
      confirmNewPassword: new FormControl('', [Validators.minLength(6)]),
      imageUrl: new FormControl(null)
    },
    { validators: [this.passwordMatchValidator, this.passwordMatchValidator2] });


    this.populateForm();
  }

  populateForm(){

    const loggedUser: LoggedUser = this.userService.getLoggedInUser();

    this.userService.getUserById(loggedUser.id).subscribe(
      {
        next: (response: UserResponse) =>  {

          this.currentUserWithDetails = response;
    
          this.profileForm.reset({
            firstName: this.currentUserWithDetails.firstName,
            lastName: this.currentUserWithDetails.lastName,
            birthDate: this.currentUserWithDetails.birthDate,
            imageUrl: this.currentUserWithDetails.imageUrl
          });
          
          },
       
        error: (error: HttpErrorResponse) =>  alert(error.message)
      });

  }


  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword');
    const confPassword = control.get('confirmNewPassword');
  
    if (password.value !== confPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  togglePasswordVisibilityForNew() {
    this.hideForNew = !this.hideForNew;
  }

  passwordMatchValidator2(control: AbstractControl): { [key: string]: boolean } | null {
    const currentPassword = control.get('currentPassword').value;
    const newPassword = control.get('newPassword').value;
    const confirmNewPassword = control.get('confirmNewPassword').value;
  
    const allFieldsEmpty = !currentPassword && !newPassword && !confirmNewPassword;
    const allFieldsNonEmpty = currentPassword && newPassword && confirmNewPassword;
  
    if (allFieldsEmpty || allFieldsNonEmpty) {
      return null; // Valid
    } else {
      return { passwordMismatch2: true }; // Invalid
    }
  }

  onSubmit() {

    const birthDate = this.datePipe.transform(this.profileForm.get('birthDate').value , 'yyyy-MM-dd');

    let updatePassword: number = 0;
    let oldPassword: string = ' ';
    let newPassword: string = ' ';

    if (this.profileForm.get('newPassword').value  && this.profileForm.get('newPassword').value.length > 5){

      oldPassword = this.profileForm.get('currentPassword').value;
      newPassword = this.profileForm.get('newPassword').value;
      updatePassword = 1;
    }


    const userDetails: UpdateUserModel = {

      firstName: this.profileForm.get('firstName').value,
      lastName: this.profileForm.get('lastName').value,
      birthDate: birthDate,
      oldPassword: oldPassword,
      newPassword: newPassword,
      imageUrl: this.profileForm.get('imageUrl').value,
      updatePassword: updatePassword
    }


    this.userService.updateUser(userDetails).subscribe(
      {
        next: (response: any) => {

          this.validationError = null;
          
          this.snackBar.open('Your profile is now up to date!', 'Close', {
            duration: 5000, 
          });
      },
      error: (error: HttpErrorResponse) => {
        this.validationError = error.error;
      }
    }
    );
  }
}
