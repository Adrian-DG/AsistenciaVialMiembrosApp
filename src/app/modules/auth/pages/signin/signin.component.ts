import { Component, OnInit } from '@angular/core';
import { ILoginUnitMember } from '../../interfaces/ilogin-unit-member';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
	cedulaInput!: string;
	fichaInput!: string;
	isWriting!: boolean;
	constructor(public _auth: AuthService) {}

	ngOnInit() {
		this.cedulaInput = '';
		this.fichaInput = '';
		this.isWriting = false;
	}

	hideImage = () => (this.isWriting = true);

	validateMember(): void {
		this._auth.validateMember(this.cedulaInput);
	}

	validateUnit(): void {
		this._auth.validateUnit(this.fichaInput);
	}

	loginUnitMember(): void {
		this.isWriting = false;
		const model: ILoginUnitMember = {
			cedula: this.cedulaInput,
			ficha: this.fichaInput,
		};
		this._auth.loginUnitMember(model);
	}
}
