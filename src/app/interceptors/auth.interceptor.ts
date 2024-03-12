import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SpinnerOverlayService } from '../services/spinner-overlay.service';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private readonly spinnerOverlayService: SpinnerOverlayService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        //daca nu e user inseamna ca ne inregistram ori ne logam si nu trebuie adaugat tokenul
        if (!user) {
          return next.handle(req).pipe(finalize(() => spinnerSubscription.unsubscribe()));
        }

        const modifiedReq = req.clone({
            setHeaders: {
                Authorization : `Bearer ${user.token}`
            }
        });
        return next.handle(modifiedReq).pipe(finalize(() => spinnerSubscription.unsubscribe()));
      })
    );
  }
}
