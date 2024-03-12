import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LoggedUser } from '../shared/models/logged-user.model';
import { UserResponse } from '../shared/models/user-response.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  userEntity: UserResponse;
  jwtToken: string;
  expDate: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<LoggedUser>(null);
  serverUrl : string = "http://localhost:8080";
  expTimer: any;

  
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

  constructor(private http: HttpClient, private router: Router){}

  public login(loginData) {
    return this.http.post<AuthResponseData>(this.serverUrl + "/login", loginData, {
      headers: this.requestHeader,
    })
    .pipe(
      tap(responseData => {
        this.handleAuth(
          responseData.userEntity,
          responseData.jwtToken,
          responseData.expDate
        );
      })
    );
  }

  private handleAuth(userData: UserResponse, jwtToken: string, expDate: string) {

    const expirationDate = new Date(expDate);
    console.log("data de expirare" + expirationDate)
    const loggedInUser = new LoggedUser(userData.id, userData.email, userData.phoneNrConfirmation, jwtToken, expirationDate);
    
    this.user.next(loggedInUser);
    
    const currentTime =new Date();
    const remainingTime = expirationDate.getTime() - currentTime.getTime();

    console.log("timp pana la expirare" + remainingTime);

    this.autoLogout(remainingTime);

    //salvat the object in local storage
    localStorage.setItem('userData', JSON.stringify(loggedInUser));
  }

  updatePhoneNrConfirmation(){
    const tokenData: {
      id: string;
      email: string;
      phoneNrConfirmation: string;
      jwtToken: string;
      tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    
    localStorage.removeItem('userData');

    if (!tokenData) {
      console.log("nu o gasit in local storage");
      return;
    }

    const loadedUser = new LoggedUser(
      +tokenData.id,
      tokenData.email,
      '1',
      tokenData.jwtToken,
      new Date(tokenData.tokenExpirationDate)
    );

    this.user.next(loadedUser);
    localStorage.setItem('userData', JSON.stringify(loadedUser));

  }

  autoLogin() {
    const tokenData: {
      id: string;
      email: string;
      phoneNrConfirmation: string;
      jwtToken: string;
      tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    
    if (!tokenData) {
      console.log("nu o gasit in local storage");
      return;
    }

    const loadedUser = new LoggedUser(
      +tokenData.id,
      tokenData.email,
      tokenData.phoneNrConfirmation,
      tokenData.jwtToken,
      new Date(tokenData.tokenExpirationDate)
    );
    console.log("userul scos din local storage" + loadedUser.email);

    //daca nu intra in if, inseamna ca token este null (pt ca a expirat), e setat in modelul userului (user.model.ts)
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(tokenData.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }


  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.expTimer) {
      clearTimeout(this.expTimer);
    }
    this.expTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.expTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'No User found with this email and password combination!';

    return throwError(() => new Error(errorMessage));
  }
}