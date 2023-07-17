import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment as Dev } from 'src/environments/environment';
import { environment as Prod } from 'src/environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export abstract class GenericService {
	protected endPoint: string = '';
	protected env: string = '';

	private canLeaveSource = new BehaviorSubject<boolean>(false);
	public canLeave$ = this.canLeaveSource.asObservable();

	private isConnectedSource = new BehaviorSubject<boolean>(true);
	public isConnected$ = this.isConnectedSource.asObservable();

	constructor(
		protected $http: HttpClient,
		protected _alert: AlertController
	) {
		this.env += isDevMode() ? Dev.api_url : Prod.api_url;
		this.endPoint += this.env;

		Network.addListener(
			'networkStatusChange',
			(status: ConnectionStatus) => {
				console.log('ConnectionStatus: ', status);
				this.isConnectedSource.next(status.connected);
			}
		);
	}

	setCanleaveSource(value: boolean): void {
		this.canLeaveSource.next(value);
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
