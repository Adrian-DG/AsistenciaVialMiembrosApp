import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

import { Dialogs } from '@awesome-cordova-plugins/dialogs/ngx';

@Injectable({
	providedIn: 'root',
})
export class SessionGuard implements CanActivate {
	constructor(private _auth: AuthService, private _dialog: Dialogs) {}

	async canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean> {
		const value = await this._dialog.confirm(
			'Si acepta se terminara la sesion, sera dirigido nuevamente al formulario de ingreso.',
			'Desea salir cerrar la sesion ?',
			['Cancelar', 'Aceptar']
		);

		if (value == 1) {
			this._auth.logout();
			return true;
		} else {
			return false;
		}
	}
}
