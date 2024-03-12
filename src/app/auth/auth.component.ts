import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  public validationError: string;
  hide: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  onSubmit(loginForm: NgForm) {
    this.authService.login(loginForm.value).subscribe(
      {
        next: (response: any) => {
        // console.log(response);
        this.router.navigate(['/notifications']);
      },
      error: (error: HttpErrorResponse) => {
        this.validationError = error.error;
      }
    });
  }

}
