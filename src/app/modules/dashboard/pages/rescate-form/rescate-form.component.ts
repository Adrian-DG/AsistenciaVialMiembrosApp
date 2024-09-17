import { Component, OnInit } from '@angular/core';
import {
	IAsistenciaRescateCreate,
	IManiobrasAplicadasRescate,
	IVehiculosInvolucrados,
} from '../../interfaces/iasistencia-rescate-create';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { AsistenciaRescateService } from '../../services/rescate/asistencia-rescate.service';

import { ProvinciasArray } from '../../constants/app.const';

@Component({
	selector: 'ReportarAsistencia-rescate-form',
	templateUrl: './rescate-form.component.html',
	styleUrls: ['./rescate-form.component.scss'],
})
export class RescateFormComponent implements OnInit {
	constructor(
		public _cache: CacheService,
		private _rescate: AsistenciaRescateService
	) {}

	proviciasList = ProvinciasArray;

	rescateObj: IAsistenciaRescateCreate = {
		tipoDocumento: 0,
		identificacion: '',
		nombre: '',
		apellido: '',
		edad: 0,
		telefono: '',
		sexo: 0,
		provinciaId: 0,
		municipioId: 0,
		nacionalidadId: 0,
		condicionVictima: 0,
		cantidadPersonasFallecidas: 0,
		cantidadPersonasLesionadas: 0,
		cantidadVehiculos: 0,
		detalles: '',
		entidadRecibioPertenencias: 0,
		entidadRecibioVictima: 0,
		tipoAsistencia: 0,
		unidadId: 0,
		unidadMiembroId: 0,
		vehiculosInvolucrados: [],
		maniobrasAplicadas: [],
	};

	ngOnInit() {}

	async createAsistance(): Promise<void> {
		this.rescateObj.unidadMiembroId = await this._rescate.getUnitMemberId();
		this._rescate.createAsistenciaRescate(this.rescateObj);
	}
}
