import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SpinnerService {
	constructor(private _loading: LoadingController) {}

	async showLoading(state: boolean): Promise<void> {
		const loading = await this._loading.create({
			message: 'Espere mientras se completa el proceso...',
			animated: true,
			duration: 2000,
			spinner: 'circular',
			translucent: true,
			keyboardClose: true,
			backdropDismiss: true,
			showBackdrop: true,
		});

		state ? loading.present() : loading.dismiss();
	}
}
