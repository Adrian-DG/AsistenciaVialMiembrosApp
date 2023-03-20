import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AlertController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor(
		private _location: Location,
		private _alert: AlertController,
		private _platform: Platform
	) {
		this.initializeApp();
	}

	initializeApp(): void {
		this._platform.backButton.subscribeWithPriority(
			10,
			(processNextHandler) => {
				console.log('Back press handler');
				this._location.isCurrentPathEqualTo('auth')
					? this.showExitConfirm()
					: this._location.back();
			}
		);
	}

	showExitConfirm() {
		this._alert
			.create({
				header: 'Cerrar aplicación',
				message: 'Esta seguro de cerrar la aplicación ?',
				backdropDismiss: false,
				buttons: [
					{
						text: 'cancelar',
						role: 'cancel',
						handler: () => {
							console.log('Application exit prevented!');
						},
					},
					{
						text: 'Exit',
						handler: () => {
							App.exitApp();
						},
					},
				],
			})
			.then((alert) => {
				alert.present();
			});
	}
}
