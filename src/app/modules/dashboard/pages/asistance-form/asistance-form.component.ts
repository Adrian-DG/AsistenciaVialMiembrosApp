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

	asistanceForm: FormGroup = this.$fb.group({
		identificacion: ['', [Validators.required, Validators.minLength(11)]],
		nombreCiudadano: [''],
		telefono: [''],
		vehiculoTipoId: [],
		vehiculoColorId: [],
		vehiculoModeloId: [],
		vehiculoMarcaId: [],
		latitud: [''],
		longitud: [''],
		municipioId: [],
		provinciaId: [],
		unidadMiembroId: [0],
		tipoAsistenciaId: [0],
		comentarios: [''],
		reportadoPor: [],
	});

	ngOnInit() {
		this.getUnitMemberId();
	}

	async getUnitMemberId(): Promise<number> {
		const info = await this._auth.getStorageData();
		return info[1];
	}

	async createAsistance(): Promise<any> {
		this.isLoading = true;
		let asistance: IAsistanceCreate = this.asistanceForm.value;
		asistance.unidadMiembroId = await this.getUnitMemberId();
		this._asistencia.createAsistance(asistance);
		this.isLoading = false;
	}
}
