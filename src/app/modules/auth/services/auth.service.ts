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
import { AlertController, ToastController } from '@ionic/angular';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SpinnerService } from '../../generic/services/spinner/spinner.service';
import { IUpdateStatusUnit } from '../../dashboard/interfaces/iupdate-status-unit';

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
		protected override _alert: AlertController,
		private _storage: Storage,
		private _toast: ToastController,
		private _jwt: JwtHelperService,
		private _spinner: SpinnerService
	) {
		super($http, _alert);
		this.initStorage();
	}

	async initStorage(): Promise<void> {
		await this._storage.create();
	}

	async checkIfAuthenticated(): Promise<boolean> {
		const storageExist = (await this._storage.length()) > 0;
		console.log('Does storage exists: ', storageExist);
		if (storageExist) {
			const token = await this._storage.get('token');
			const hasExpired = this._jwt.isTokenExpired(token);
			console.log('Has Token expire: ', hasExpired ? 'Si' : 'No');

			// Si el token expiro se borraran los datos del storage
			if (hasExpired) {
				await this._storage.clear();
				return false;
			} else {
				return true;
			}
		} else {
			console.log('Storage not exists');
			return false;
		}
	}

	async clearSession(): Promise<void> {
		await this._storage.clear();
		this.isMemberValidSource.next(false);
		this.isUnitValidSource.next(false);
		this.isAuthorizedSource.next(false);
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

				if (!response.isAuthorized && response.created) {
					this.showToast(
						'El usuario existe, pero aun no ha sido autorizado'
					);
				}

				this.isMemberValidSource.next(
					response.created && response.isAuthorized
				);
				this._spinner.showLoading(false);
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
				this._spinner.showLoading(false);
			});
	}

	registerMember(model: IMemberCreate): void {
		this.$http
			.post<boolean>(`${this.endPoint}/miembros/createApp`, model)
			.subscribe(
				(response: boolean) => {
					if (response) {
						this.$router.navigate(['auth/signin']);
						this._spinner.showLoading(false);
					}

					this.generateRequestResultAlert(
						`${response ? 'Exito' : 'Error'}`,
						'',
						`${
							response
								? 'El soldado se registro con exito!!'
								: 'Es probable que esta cédula ya este registrada!!'
						}`
					);
				},
				(error) =>
					this.generateRequestResultAlert(
						'Error',
						'',
						'Algo salio mal, no se pudo registrar al soldado!!'
					)
			);
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
			this._storage.get('accesoTotal'),
		]);
	}

	private async saveToStorage(model: ILoginUnitResponse): Promise<void> {
		await Promise.all([
			this._storage?.set('denominacion', model.denominacion),
			this._storage?.set('unidadMiembroId', model.unidadMiembroId),
			this._storage?.set('ficha', model.ficha),
			this._storage?.set('placa', model.placa),
			this._storage?.set('miembro', model.miembroInfo),
			this._storage?.set('token', model.token),
			this._storage?.set('esEncargado', model.esEncargado),
			this._storage?.set('accesoTotal', model.accesoTotal),
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
					this.saveToStorage(response).then(() => {
						console.log('to dashboard');
						this.$router.navigate(['dashboard']);
					});
				}
			});
	}

	async logout(ficha: IUpdateStatusUnit): Promise<void> {
		const alert = await this._alert.create({
			header: 'Cerrar Sesión',
			message: 'Si acepta se cerrara la sesión de la aplicación.',
			animated: true,
			translucent: true,
			buttons: [
				{ text: 'Cancelar', role: 'cancenl' },
				{
					text: 'Aceptar',
					role: 'confirm',
					handler: async () => {
						await this.clearSession();
						this.$http
							.put<boolean>(
								`${this.endPoint}/unidades/close-session`,
								ficha
							)
							.subscribe((response: boolean) => {
								if (response) {
									this.$router.navigateByUrl('auth/signin');
								}
							});
					},
				},
			],
		});

		await alert.present();
	}
}
