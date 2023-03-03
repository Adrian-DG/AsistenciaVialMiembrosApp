import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheService } from 'src/app/modules/cache/services/cache.service';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
})
export class AsistanceFormComponent implements OnInit {
	constructor(private $fb: FormBuilder, public _cache: CacheService) {}

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
		unidadMiembro: [],
		tipoAsistenciaId: [],
	});

	ngOnInit() {}

	createAsistance(): void {}
}
