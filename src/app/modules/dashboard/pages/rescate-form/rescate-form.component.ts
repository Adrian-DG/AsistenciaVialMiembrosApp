import { Component, OnInit } from '@angular/core';
import {
	IAsistenciaRescateCreate,
	IManiobrasAplicadasRescate,
	IVehiculosInvolucrados,
} from '../../interfaces/iasistencia-rescate-create';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { AsistenciaRescateService } from '../../services/rescate/asistencia-rescate.service';

import {
	ProvinciasArray,
	VehicleColors,
	VehicleTypesArray,
} from '../../constants/app.const';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'ReportarAsistencia-rescate-form',
	templateUrl: './rescate-form.component.html',
	styleUrls: ['./rescate-form.component.scss'],
})
export class RescateFormComponent implements OnInit {
	constructor(
		public _cache: CacheService,
		private _rescate: AsistenciaRescateService,
		private $fb: FormBuilder
	) {}

	proviciasList = ProvinciasArray;
	coloresList = VehicleColors;
	tiposList = VehicleTypesArray;

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
		cantidadVehiculos: 1,
		detalles: '',
		entidadRecibioPertenencias: 0,
		entidadRecibioVictima: 0,
		tipoAsistencia: 0,
		unidadId: 0,
		unidadMiembroId: 0,
		vehiculosInvolucrados: [],
		maniobrasAplicadas: [],
	};

	vehiculosInvolucradosForm = this.$fb.group({
		vehiculosArray: this.$fb.array([
			new FormGroup({
				vehiculoTipoId: new FormControl(0),
				vehiculoColorId: new FormControl(0),
				vehiculoMarcaId: new FormControl(0),
				marcaTxt: new FormControl(''),
				vehiculoModeloId: new FormControl(0),
				modeloTxt: new FormControl(''),
				placa: new FormControl(''),
			}),
		]),
	});

	ngOnInit() {
		this._cache.getResource('VehiculoMarca');
		this._cache.getResource('VehiculoMarca');
	}

	get isFormValid() {
		const { provinciaId, municipioId } = this.rescateObj;
		return [provinciaId, municipioId].every((value) => value > 0);
	}

	addVehicle() {
		this.vehiculosInvolucradosForm.controls.vehiculosArray.push(
			new FormGroup({
				vehiculoTipoId: new FormControl(0),
				vehiculoColorId: new FormControl(0),
				vehiculoMarcaId: new FormControl(0),
				marcaTxt: new FormControl(''),
				vehiculoModeloId: new FormControl(0),
				modeloTxt: new FormControl(''),
				placa: new FormControl(''),
			})
		);

		this.rescateObj.cantidadVehiculos += 1;
	}

	async createAsistance(): Promise<void> {
		this.rescateObj.unidadMiembroId = await this._rescate.getUnitMemberId();
		this.rescateObj.vehiculosInvolucrados = this.vehiculosInvolucradosForm
			.controls.vehiculosArray.value as IVehiculosInvolucrados[];
		this._rescate.createAsistenciaRescate(this.rescateObj);
	}
}
