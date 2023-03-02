import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from '../../generic/services/generic.service';
import { ILoginUnitMember } from '../interfaces/ilogin-unit-member';
import { ILoginUnitResponse } from '../interfaces/ilogin-unit-response';

import { Storage } from '@ionic/storage-angular';
import { IMemberCreate } from '../interfaces/imember-create';
import { IMemberUnitInfo } from '../../dashboard/interfaces/imember-unit-info';

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
		protected $router: Router,
		private _storage: Storage
	) {
		super($http);
		this.endPoint += `/auth`;
		this._storage.create();
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

	registerMember(model: IMemberCreate): void {
		this.$http
			.post<boolean>(`${this.endPoint}/member/create`, model)
			.subscribe((response: boolean) => {
				if (response) {
					this.$router.navigate(['auth/signin']);
				}
			});
	}

	getStorageData(): Promise<any[]> {
		const denominacion = this._storage.get('denominacion');
		const ficha = this._storage.get('ficha');
		const miembro = this._storage.get('miembro');
		const placa = this._storage.get('placa');
		const tramo = this._storage.get('tramo');
		return Promise.all([denominacion, ficha, miembro, placa, tramo]);
	}

	private saveToStorage(model: ILoginUnitResponse): void {
		this._storage?.set('denominacion', model.denominacion);
		this._storage?.set('ficha', model.ficha);
		this._storage?.set('placa', model.placa);
		this._storage?.set('miembro', model.miembroInfo);
		this._storage?.set('tramo', model.tramo);
		this._storage?.set('token', model.token);
	}

	loginUnitMember(model: ILoginUnitMember): void {
		this.$http
			.post<ILoginUnitResponse>(`${this.endPoint}/assign`, model)
			.subscribe((response: ILoginUnitResponse) => {
				if (response.estatus) {
					this.saveToStorage(response);
					this.$router.navigate(['dashboard']);
				}
			});
	}
}
