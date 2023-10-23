import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanDeactivate,
	Route,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
	BehaviorSubject,
	Observable,
	firstValueFrom,
	lastValueFrom,
} from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { IndexComponent } from '../modules/dashboard/pages/index/index.component';
import { GenericService } from '../modules/generic/services/generic.service';

export interface ComponentCanDeactivate {
	canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable({
	providedIn: 'root',
})
export class LeaveGuard implements CanDeactivate<ComponentCanDeactivate> {
	constructor(
		private _generic: GenericService,
		private $router: Router,
		private _alert: AlertController
	) {}

	async getAlertResolver(): Promise<boolean> {
		return new Promise(async (resolve) => {
			const confirm = await this._alert.create({
				header: 'Completar formulario',
				subHeader: 'Se perderan los cambios',
				message: 'Si acepta, se perderan los datos del formulario.',
				translucent: true,
				animated: true,
				buttons: [
					{
						text: 'cancelar',
						role: 'cancel',
						handler: () => resolve(false),
					},
					{
						text: 'aceptar',
						role: 'confirm',
						handler: () => resolve(true),
					},
				],
			});

			await confirm.present();
		});
	}

	async canDeactivate(
		component: ComponentCanDeactivate,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot
	): Promise<boolean> {
		return component.canDeactivate()
			? await this.getAlertResolver()
			: new Promise(async (resolve) => resolve(true));
	}
}
