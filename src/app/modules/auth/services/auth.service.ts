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
import { ICreatedAuthorizedMember } from '../interfaces/icreated-authorized-member';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root',
})
export class AuthService extends GenericService {
	private isMemberValidSource = new BehaviorSubject<boolean>(false);
	public isMemberValid$ = this.isMemberValidSource.asObservable();
	private isUnitValidSource = new BehaviorSubject<boolean>(false);
	public isUnitValid$ = this.isUnitValidSource.asObservable();

	private isAuthorizedSource = new BehaviorSubject<boolean>(false);
	public isAuthorized$ = this.isAuthorizedSource.asObservable();

	constructor(
		protected override $http: HttpClient,
		protected $router: Router,
		private _storage: Storage,
		private _toast: ToastController
	) {
		super($http);
		this._storage.create();
	}

	checkIfAuthenticated() {
		return this._storage.length();
	}

	getToken(): Promise<any> {
		return this._storage.get('token');
	}

	getParams(key: string, value: any): HttpParams {
		return new HttpParams().set(key, value);
	}

	async showToast(message: string) {
		const toast = await this._toast.create({
			message: message,
			duration: 5000,
			position: 'middle',
			animated: true,
			icon: 'alert-circle-outline',
			color: 'light',
		});

		toast.present();
	}

	validateMember(cedula: string): void {
		this.$http
			.get<ICreatedAuthorizedMember>(
				`${this.endPoint}/miembros/confirm`,
				{
					params: this.getParams('Cedula', cedula),
				}
			)
			.subscribe((response: ICreatedAuthorizedMember) => {
				if (!response.created) {
					this.$router.navigate(['auth/signup']);
				}

				if (!response.isAuthorized) {
					console.log('display toast');
					this.showToast(
						'El usuario existe, pero aun no ha sido autorizado'
					);
				}

				this.isMemberValidSource.next(
					response.created && response.isAuthorized
				);
			});
	}

	validateUnit(ficha: string): void {
		this.$http
			.get<boolean>(`${this.endPoint}/unidades/confirm`, {
				params: this.getParams('Ficha', ficha),
			})
			.subscribe((response: boolean) => {
				if (!response) {
					this.showToast(
						'No hay unidades registradas con esta ficha!!'
					);
				}
				this.isUnitValidSource.next(response);
			});
	}

	registerMember(model: IMemberCreate): void {
		this.$http
			.post<boolean>(`${this.endPoint}/miembros/createApp`, model)
			.subscribe((response: boolean) => {
				if (response) {
					this.$router.navigate(['auth/signin']);
				}
			});
	}

	getStorageData(): Promise<any[]> {
		return Promise.all([
			this._storage.get('denominacion'),
			this._storage.get('unidadMiembroId'),
			this._storage.get('ficha'),
			this._storage.get('miembro'),
			this._storage.get('placa'),
			this._storage.get('tramo'),
			this._storage.get('esEncargado'),
		]);
	}

	private async saveToStorage(model: ILoginUnitResponse): Promise<void> {
		await Promise.all([
			this._storage?.set('denominacion', model.denominacion),
			this._storage?.set('unidadMiembroId', model.unidadMiembroId),
			this._storage?.set('ficha', model.ficha),
			this._storage?.set('placa', model.placa),
			this._storage?.set('miembro', model.miembroInfo),
			this._storage?.set('tramo', model.tramo),
			this._storage?.set('token', model.token),
			this._storage.set('esEncargado', model.esEncargado),
		]);
	}

	loginUnitMember(model: ILoginUnitMember): void {
		this.$http
			.post<ILoginUnitResponse>(
				`${this.endPoint}/unidadmiembro/create`,
				model
			)
			.subscribe((response: ILoginUnitResponse) => {
				if (response.estatus) {
					console.log('The response was: ', response.estatus);
					this.saveToStorage(response);
					console.log('to dashboard');
					this.$router.navigate(['dashboard']);
				}
			});
	}

	logout(): void {
		this._storage.clear();
		this.$router.navigate(['']);
	}
}
