import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
	constructor(private _auth: AuthService, private $router: Router) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		let isAuthenticated = false;
		this._auth.checkIfAuthenticated();
		this._auth.isAuthenticated$.subscribe((res: boolean) => {
			if (res) {
				isAuthenticated = res;
				this.$router.navigate(['dashboard']);
			}
		});
		return isAuthenticated;
	}
}
