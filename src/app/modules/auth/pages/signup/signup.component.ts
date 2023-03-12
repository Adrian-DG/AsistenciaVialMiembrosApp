import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGenericEnum } from 'src/app/modules/cache/interfaces/igeneric-enum';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
	rangos: IGenericEnum[] = [];
	instituciones: IGenericEnum[] = [
		{ id: 0, nombre: 'ninguna' },
		{ id: 1, nombre: 'Ministerio de Defensa' },
		{ id: 2, nombre: 'Ejercito Dominicano' },
		{ id: 3, nombre: 'Armada Dominicana' },
		{ id: 4, nombre: 'Fuerza Aerea Dominicana' },
		{ id: 5, nombre: 'Policia Nacional' },
	];

	constructor(
		private _auth: AuthService,
		private $fb: FormBuilder,
		public _cache: CacheService
	) {}

	registerForm: FormGroup = this.$fb.group({
		cedula: ['', [Validators.required, Validators.maxLength(11)]],
		nombre: ['', [Validators.required]],
		lastname: ['', [Validators.required]],
		sexo: [, [Validators.required]],
		rangoId: [0, [Validators.required]],
		institucion: [0, Validators.required],
	});

	ngOnInit() {
		this._cache.getResource('rangos');
	}

	registerMember(): void {
		this._auth.registerMember(this.registerForm.value);
	}
}
