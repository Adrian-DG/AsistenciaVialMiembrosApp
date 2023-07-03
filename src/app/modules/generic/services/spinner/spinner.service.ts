import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SpinnerService {
	private isLoadingSource = new BehaviorSubject<boolean>(false);
	public isLoading$ = this.isLoadingSource.asObservable();

	showLoading(value: boolean): void {
		this.isLoadingSource.next(value);
	}
}
