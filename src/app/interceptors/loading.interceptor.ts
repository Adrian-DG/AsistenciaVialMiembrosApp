import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable, filter, finalize } from 'rxjs';
import { SpinnerService } from '../modules/generic/services/spinner/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
	constructor(private _spinner: SpinnerService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		this._spinner.showLoading(true);
		return next
			.handle(request)
			.pipe(finalize(() => this._spinner.showLoading(false)));
	}
}
