import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
})
export class AsistanceFormComponent implements OnInit {
	isLoading: boolean = false;
	spinner: string = `
	<ion-label>Default</ion-label>
		<ion-spinner></ion-spinner> 
	</ion-item>`;
	constructor(
		private $fb: FormBuilder,
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencia: AsistanceService
	) {}

	// asistanceForm: FormGroup = this.$fb.group({
	// 	identificacion: ['', [Validators.required, Validators.minLength(11)]],
	// 	nombre: [''],
	// 	apellido: [''],
	// 	genero: [0],
	// 	esExtranjero: [false],
	// 	telefono: [''],
	// 	vehiculoTipoId: [],
	// 	vehiculoColorId: [],
	// 	vehiculoModeloId: [],
	// 	vehiculoMarcaId: [],
	// 	placa: [''],
	// 	municipioId: [],
	// 	provinciaId: [],
	// 	unidadMiembroId: [0],
	// 	comentario: [''],
	// 	reportadoPor: [],
	// });

	ciudadanoForm: FormGroup = this.$fb.group({
		identificacion: ['', [Validators.required, Validators.minLength(11)]],
		nombre: [''],
		apellido: [''],
		genero: [0],
		esExtranjero: [false],
		telefono: [''],
	});

	vehiculoForm: FormGroup = this.$fb.group({
		vehiculoTipoId: [],
		vehiculoColorId: [],
		vehiculoModeloId: [],
		vehiculoMarcaId: [],
		placa: [''],
	});

	ubicacionForm: FormGroup = this.$fb.group({
		municipioId: [],
		provinciaId: [],
	});

	imagenes: string[] = [];
	coordenadas: string = '';
	reportadoPor: number = 0;
	tipoAsistencias: number[] = [];
	comentario: string = '';

	ngOnInit() {
		this.getUnitMemberId();
	}

	async getUnitMemberId(): Promise<number> {
		const info = await this._auth.getStorageData();
		return info[1];
	}

	async createAsistance(): Promise<any> {
		this.isLoading = true;

		const {
			identificacion,
			nombre,
			apellido,
			genero,
			esExtranjero,
			telefono,
		} = this.ciudadanoForm.value;

		const {
			vehiculoTipoId,
			vehiculoColorId,
			vehiculoMarcaId,
			vehiculoModeloId,
			placa,
		} = this.vehiculoForm.value;

		const { provinciaId, municipioId } = this.ubicacionForm.value;

		const newAsistencia: IAsistanceCreate = {
			// ciudadano
			identificacion: identificacion,
			nombre: nombre,
			apellido: apellido,
			genero: genero,
			esExtranjero: esExtranjero,
			telefono: telefono,
			// vehiculo
			vehiculoColorId: vehiculoColorId,
			vehiculoTipoId: vehiculoTipoId,
			vehiculoMarcaId: vehiculoMarcaId,
			vehiculoModeloId: vehiculoModeloId,
			placa: placa,
			// ubicacion
			provinciaId: provinciaId,
			municipioId: municipioId,
			comentario: this.comentario,
			coordenadas: this.coordenadas,
			reportadoPor: this.reportadoPor,
			tipoAsistencias: this.tipoAsistencias,
			unidadMiembroId: 0,
			imagenes: this.imagenes,
		};

		newAsistencia.unidadMiembroId = await this.getUnitMemberId();

		this._asistencia.createAsistance(newAsistencia);
		this.isLoading = false;
	}
}
