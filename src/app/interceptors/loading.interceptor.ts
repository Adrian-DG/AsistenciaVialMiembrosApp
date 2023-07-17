import { Injectable, isDevMode } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, filter, finalize, throwError } from 'rxjs';
import { SpinnerService } from '../modules/generic/services/spinner/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
	constructor(private _spinner: SpinnerService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		this._spinner.showLoading(true);
		return next.handle(request).pipe(
			finalize(() => {
				isDevMode()
					? setTimeout(() => this._spinner.showLoading(false), 2000)
					: this._spinner.showLoading(false);
			}),
			catchError((error: HttpErrorResponse) => {
				return throwError(Object.entries(error));
			})
		);
	}
}
