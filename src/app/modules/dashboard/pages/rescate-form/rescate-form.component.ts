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
import { IGenericEnum } from 'src/app/modules/cache/interfaces/igeneric-enum';

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
	marcasList!: IGenericEnum[];
	modelosList!: IGenericEnum[];

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
		this.getMarcas();
		this._cache.getResource('nacionalidades');
	}

	getMarcas() {
		this._cache
			.getMarcas()
			.subscribe((data: IGenericEnum[]) => (this.marcasList = data));
	}

	getModelos(tipo: number, marca: number) {
		this._cache
			.getModelosByMarca(tipo, marca)
			.subscribe((data: IGenericEnum[]) => (this.modelosList = data));
	}

	get isFormValid() {
		const { provinciaId, municipioId } = this.rescateObj;
		return [provinciaId, municipioId].every((value) => value > 0);
	}

	addVehicle() {
		let vehiculos = (
			this.vehiculosInvolucradosForm.controls.vehiculosArray
				.value as IVehiculosInvolucrados[]
		)
			.filter((v) => v.vehiculoTipoId > 0 && v.vehiculoColorId > 0)
			.map((v) => {
				v.vehiculoMarcaId = (v.vehiculoMarcaId as any).id;
				v.vehiculoModeloId = (v.vehiculoModeloId as any).id;
			});

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
		this._rescate.createAsistenciaRescate(this.rescateObj);
	}
}
