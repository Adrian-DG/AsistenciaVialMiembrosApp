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
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { IndexComponent } from '../modules/dashboard/pages/index/index.component';

@Injectable({
	providedIn: 'root',
})
export class LeaveGuard implements CanDeactivate<IndexComponent> {
	private canLeaveSource = new BehaviorSubject<boolean>(false);
	public canLeave$ = this.canLeaveSource.asObservable();

	constructor(
		private _auth: AuthService,
		private $router: Router,
		private _alert: AlertController
	) {}

	async canDeactivate<IndexComponent>(
		component: IndexComponent,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot
	): Promise<boolean> {
		return new Promise(async (resolve) => {
			const confirm = await this._alert.create({
				header: 'Completar formulario',
				subHeader: 'Se perderan los cambios',
				message:
					'Si acepta, se perderan los datos de la asistencia y el formulario.',
				translucent: true,
				animated: true,
				buttons: [
					{ text: 'cancelar', role: 'cancel' },
					{
						text: 'aceptar',
						role: 'confirm',
						handler: () => {
							return resolve(true);
						},
					},
				],
			});

			await confirm.present();
		});
	}
}
