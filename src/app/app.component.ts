import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth/services/auth.service';
import { PlatformLocation } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { NewVersionService } from './modules/generic/services/NewVersion/new-version.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(
		private $router: Router,
		// private location: PlatformLocation,
		// private _alert: AlertController,
		private _newVersionService: NewVersionService
	) {
		// this.location.onPopState(() => {
		// 	this._alert.create({
		// 		header: 'Alerta',
		// 		subHeader: 'Desea cerrar su sesión ?',
		// 		message:
		// 			'Si acepta se cerrara la sesión y tendra que volver a iniciar sesion.',
		// 	});
		// });
	}

	ngOnInit() {
		this._newVersionService.checkForUpdate();
		this.$router.navigate(['dashboard']);
	}
}
