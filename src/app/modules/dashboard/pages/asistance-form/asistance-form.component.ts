import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
})
export class AsistanceFormComponent implements OnInit {
	constructor(
		private $fb: FormBuilder,
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencia: AsistanceService
	) {}

	private unidadMiembroId: number = 0;

	asistanceForm: FormGroup = this.$fb.group({
		identificacion: ['', [Validators.required, Validators.minLength(11)]],
		nombreCompleto: [''],
		edad: [0],
		telefono: [''],
		vehiculoTipoId: [],
		vehiculoColorId: [],
		vehiculoModeloId: [],
		vehiculoMarcaId: [],
		latitud: [''],
		longitud: [''],
		municipioId: [],
		provinciaId: [],
		unidadMiembroId: [this.unidadMiembroId],
		tipoAsistenciaId: [],
		reportadoPor: [],
	});

	ngOnInit() {
		this._auth
			.getStorageData()
			.then((response: any[]) => (this.unidadMiembroId = response[1]));
	}

	createAsistance(): void {
		this._asistencia.createAsistance(this.asistanceForm.value);
	}
}
