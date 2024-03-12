import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmRegisterPopupComponent } from '../confirm-register-popup/confirm-register-popup.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public validationError: string;
  hide: boolean = true;

  //month starts with 0
  public maxDate:Date = new Date(2018, 11, 31);

  registerForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birthDate: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      imageUrl: new FormControl(null)
    },
    { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confPassword = control.get('confPassword');
  
    if (password.value !== confPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  onSubmit() {

    const { confPassword, ...formData } = this.registerForm.value;

    formData.birthDate = this.datePipe.transform(formData.birthDate , 'yyyy-MM-dd');
    const ceva = this.datePipe.transform(formData.birthDate , 'yyyy-MM-dd'); 

    this.userService.addUser(formData).subscribe(
      {
        next: (response: any) => {
          const dialogRefForCheckPopup = this.dialog.open(ConfirmRegisterPopupComponent, {
            width: '400px'
          });
      },
      error: (error: HttpErrorResponse) => {
        this.validationError = error.error;
      }
    }
    );
  }

  onConfirmRegister(){
    const dialogRefForCheckPopup = this.dialog.open(ConfirmRegisterPopupComponent, {
      width: '400px'
    });
  }
}
