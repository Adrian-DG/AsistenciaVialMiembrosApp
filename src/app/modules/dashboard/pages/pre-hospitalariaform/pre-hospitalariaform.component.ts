import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IAsistenciaPreHospitalaria } from '../../interfaces/iasistencia-pre-hospitalaria';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ILoginUnitResponse } from 'src/app/modules/auth/interfaces/ilogin-unit-response';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { AlertController } from '@ionic/angular';

@Component({
	selector: 'ReportarAsistencia-pre-hospitalariaform',
	templateUrl: './pre-hospitalariaform.component.html',
	styleUrls: ['./pre-hospitalariaform.component.scss'],
})
export class PreHospitalariaformComponent implements OnInit, AfterViewInit {
	public asistencia: IAsistenciaPreHospitalaria = {
		identificacion: '',
		nombre: '',
		apellido: '',
		sexo: 0,
		edad: 0,
		telefono: '',
		personaDesconocidad: false,
		nacionalidadId: 0,
		tipoAsistencia: 0,
		tipoCausa: 0,
		esTraslado: true,
		causaTraslado: 0,
		despachadaPor: 0,
		apoyoBrindado: 0,
		esEventoCampo: false,
		esEventoEspecial: false,
		nombreEventoEspecial: '',
		zona: 0,
		provinciaId: 0,
		municipioId: 0,
		unidadMiembroId: 0,
		hospitalId: 0,
		personaRecibioEnHospital: '',
		AntecedentesMorbidos: '',
		detalleAsistencia: '',
		frecuenciaCardiaca: 0,
		frecuenciaRespiratoria: 0,
		tensionArterialSistolica: 0,
		tensionArterialDiastolica: 0,
		saturacionParcialOxigeno: 0,
		temperatura: 0,

		LlenadoCapilar: 0,
		aperturaOcular: 0,
		respuestaVerbal: 0,
		respuestaMotora: 0,

		hallazgoPositivo: '',
		diagnosticoPresuntivo: '',
		procedimientosRealizados: '',
		insumosUtilizados: '',

		medicoId: 0,
		componente1Id: 0,
		componente2Id: 0,
		reguladorEmergenciaId: 0,
	};

	constructor(
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencias: AsistanceService,
		private _alert: AlertController
	) {}

	ngOnInit() {
		this._auth.getStorageData().then((data: any[]) => {
			console.log(data);
			this.asistencia.unidadMiembroId = data[1];
		});
	}

	ngAfterViewInit(): void {
		this._cache.getResource('nacionalidades');
	}

	async createAsistencia(): Promise<void> {
		const {
			despachadaPor,
			zona,
			provinciaId,
			municipioId,
			tipoAsistencia,
			reguladorEmergenciaId,
			hospitalId,
		} = this.asistencia;

		if (
			[
				despachadaPor,
				zona,
				provinciaId,
				municipioId,
				tipoAsistencia,
				reguladorEmergenciaId,
			].every((value) => value > 0)
		) {
			this._asistencias.CreateAsistenciaPreHospitalariaAgente(
				this.asistencia
			);
		} else {
			const alert = await this._alert.create({
				header: 'Error',
				subHeader:
					'Falta información, favor validar los siguientes campos:',
				message: `
				- Tipo de despacho</br>
				- Zona o región</br>
				- Provincia</br>
				- Municipio</br>
				- Tipo asistencia</br>
				- Regulador de la emergencia</br>
				`,
				buttons: ['Aceptar'],
			});

			await alert.present();
		}
	}
}
