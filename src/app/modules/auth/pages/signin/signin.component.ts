import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
	cedulaInput: string = '';
	fichaInput: string = '';
	constructor(public _auth: AuthService) {}

	ngOnInit() {}

	validateMember(): void {
		this._auth.validateMember(this.cedulaInput);
	}

	validateUnit(): void {
		this._auth.validateUnit(this.fichaInput);
	}

	loginUnitMember(): void {
		// TODO:implement
	}
}
