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
		{ id: 2, nombre: 'ERD' },
		{ id: 3, nombre: 'ARD' },
		{ id: 4, nombre: 'FARD' },
		{ id: 5, nombre: 'PN' },
		{ id: 6, nombre: 'MOPC' },
		{ id: 0, nombre: 'ninguna' },
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
