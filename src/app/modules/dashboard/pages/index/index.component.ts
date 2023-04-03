import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterViewInit {
	infoUser: IMemberUnitInfo | null = null;
	constructor(
		private _auth: AuthService,
		public _asistencias: AsistanceService
	) {}

	ngOnInit() {
		this._auth.getStorageData().then((response) => {
			console.log(response);
			this.infoUser = {
				denominacion: response[0],
				unidadMiembroId: response[1],
				ficha: response[2],
				miembro: response[3],
				placa: response[4],
				tramo: response[5],
			};
		});
	}

	ngAfterViewInit(): void {
		// TODO: asegurarse que la ficha pase
		if (this.infoUser) {
			// this._asistencias.getTotalAsistenciasUnidad(
			// 	this.infoUser?.unidadMiembroId
			// );
			this._asistencias.getAsistenciasUnidad(
				this.infoUser?.ficha.toString()
			);
		}
	}

	handleRefresh(event: any) {
		setTimeout(() => {
			if (this.infoUser?.ficha) {
				this._asistencias.getTotalAsistenciasUnidad(
					this.infoUser?.unidadMiembroId
				);

				this._asistencias.getAsistenciasUnidad(
					this.infoUser?.ficha.toString()
				);
			}
			event.target.complete();
		}, 2000);
	}
}
