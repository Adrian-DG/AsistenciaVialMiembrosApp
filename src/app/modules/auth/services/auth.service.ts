import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from '../../generic/services/generic.service';
import { ILoginUnitMember } from '../interfaces/ilogin-unit-member';
import { ILoginUnitResponse } from '../interfaces/ilogin-unit-response';

@Injectable({
	providedIn: 'root',
})
export class AuthService extends GenericService {
	private isMemberValidSource = new BehaviorSubject<boolean>(false);
	public isMemberValid$ = this.isMemberValidSource.asObservable();
	private isUnitValidSource = new BehaviorSubject<boolean>(false);
	public isUnitValid$ = this.isUnitValidSource.asObservable();

	constructor(
		protected override $http: HttpClient,
		protected $router: Router
	) {
		super($http);
		this.endPoint += `/auth`;
	}

	getParams(key: string, value: any): HttpParams {
		return new HttpParams().set(key, value);
	}

	validateMember(cedula: string): void {
		this.$http
			.get<boolean>(`${this.endPoint}/member/confirm`, {
				params: this.getParams('Cedula', cedula),
			})
			.subscribe((response: boolean) => {
				if (!response) {
					this.$router.navigate(['auth/signup']);
				}
				this.isMemberValidSource.next(response);
			});
	}

	validateUnit(ficha: string): void {
		this.$http
			.get<boolean>(`${this.endPoint}/unit/confirm`, {
				params: this.getParams('Ficha', ficha),
			})
			.subscribe((response: boolean) =>
				this.isUnitValidSource.next(response)
			);
	}

	// private saveToStorage(model: ILoginUnitResponse): void {
	// 	this.STORAGE?.set('denominacion', model.denominacion);
	// 	this.STORAGE?.set('ficha', model.ficha);
	// 	this.STORAGE?.set('placa', model.placa);
	// 	this.STORAGE?.set('miembro', model.miembroInfo);
	// 	this.STORAGE?.set('token', model.token);
	// }

	loginUnitMember(model: ILoginUnitMember): void {
		this.$http
			.post<ILoginUnitResponse>(`${this.endPoint}/assign`, model)
			.subscribe((response: ILoginUnitResponse) => {});
	}
}
