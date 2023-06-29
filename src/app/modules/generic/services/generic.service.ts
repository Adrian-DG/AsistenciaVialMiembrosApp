import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment as Dev } from 'src/environments/environment';
import { environment as Prod } from 'src/environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected endPoint: string = '';
	protected env: string = '';

	constructor(
		protected $http: HttpClient,
		protected _alert: AlertController
	) {
		this.env += isDevMode() ? Dev.api_url : Prod.api_url;
		this.endPoint += this.env;
	}

	public async generateRequestResultAlert(
		header: string,
		subHeader: string,
		message: string
	): Promise<void> {
		const alert = await this._alert.create({
			header: header,
			subHeader: subHeader,
			message: message,
			buttons: ['ok'],
			animated: true,
		});
		await alert.present();
	}
}
