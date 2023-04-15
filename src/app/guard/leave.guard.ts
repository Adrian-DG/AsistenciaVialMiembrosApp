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
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';
import { IndexComponent } from '../modules/dashboard/pages/index/index.component';

@Injectable({
	providedIn: 'root',
})
export class LeaveGuard implements CanDeactivate<IndexComponent> {
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
		let canLeave = false;

		const confirm = await this._alert.create({
			header: 'Confimación',
			subHeader: 'Confirmar cierre de sesión',
			message:
				'Si acepta se cerrar esta sessión tendra que loggearse nuevamente para usar la aplicación.',
			buttons: [
				{ text: 'cancelar' },
				{
					text: 'aceptar',
					handler: () => {
						this._auth.clearSession();
						canLeave = true;
					},
				},
			],
			animated: true,
			translucent: true,
			keyboardClose: true,
		});

		confirm.present();

		return canLeave;
	}
}
