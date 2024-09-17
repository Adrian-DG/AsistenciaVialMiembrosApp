import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GenericService } from 'src/app/modules/generic/services/generic.service';
import { IAsistenciaRescateCreate } from '../../interfaces/iasistencia-rescate-create';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AsistenciaRescateService extends GenericService {
	constructor(
		protected override $http: HttpClient,
		protected override _alert: AlertController,
		private $router: Router,
		private _auth: AuthService
	) {
		super($http, _alert);
		this.endPoint += '/asistenciasRescate';
	}

	async getUnitMemberId(): Promise<number> {
		const info = await this._auth.getStorageData();
		return info[1];
	}

	createAsistenciaRescate(model: IAsistenciaRescateCreate): void {
		this.$http
			.post<boolean>(`${this.endPoint}/create-asistencia-rescate`, model)
			.subscribe(async (response: boolean) => {
				await this.generateRequestResultAlert(
					response ? 'Ok' : 'Error',
					'',
					response
						? 'Se ha creado la asistencia'
						: 'Ocurrio un error creando la asistencia'
				);
				if (response) {
					this.$router.navigate(['dashboard']);
				}
			});
	}
}
