import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JtwInterceptor implements HttpInterceptor {

  constructor(private _auth: AuthService, private $router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;

    this._auth.getToken()
    .then((value: any) => {
      if(value) {
        request = req.clone({
          setHeaders: { Authorization: `Bearer ${value}` },
        });
      }
    });

    return next
			.handle(request)
			.pipe(
				catchError((error: HttpErrorResponse) => this.showError(error))
			);
  }

  showError(error: HttpErrorResponse) {
		if (error.status === 401) {
			this.$router.navigate(['/']);
		}

		return throwError(() => new Error('Invalid token'));
	}
}
