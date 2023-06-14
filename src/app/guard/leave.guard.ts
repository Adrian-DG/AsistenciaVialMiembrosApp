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

	canDeactivate<IndexComponent>(
		component: IndexComponent,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot
	): boolean {
		return true;
	}
}
