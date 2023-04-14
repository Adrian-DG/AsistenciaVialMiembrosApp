import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth/services/auth.service';
import { PlatformLocation } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(
		private $router: Router,
		private location: PlatformLocation,
		private _alert: AlertController
	) {
		location.onPopState(() => {
			this._alert.create({
				header: 'Alerta',
				subHeader: 'Desea cerrar su sesion ?',
				message:
					'Si acepta se cerrara la sesion y tendra que volver a iniciar sesion.',
			});
		});
	}

	ngOnInit() {
		this.$router.navigate(['dashboard']);
	}
}
