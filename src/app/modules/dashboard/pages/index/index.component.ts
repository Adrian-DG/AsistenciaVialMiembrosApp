import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { AlertController } from '@ionic/angular';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';
import { PerteneceA } from '../../constants/app.const';
import { ILoginUnitResponse } from 'src/app/modules/auth/interfaces/ilogin-unit-response';
import { BehaviorSubject } from 'rxjs';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterViewInit {
	infoUser: IMemberUnitInfo | null = null;

	estatusAsistenciaSelected: number = 1;

	public departamento = PerteneceA;

	private unSentAsistancesSource = new BehaviorSubject<number>(0);
	public unSentAsistances$ = this.unSentAsistancesSource.asObservable();

	constructor(
		private _auth: AuthService,
		public _asistencias: AsistanceService,
		private _alert: AlertController
	) {}

	ngOnInit() {
		this.initUserData();
		this.checkLocalStorage();
	}

	initUserData(): void {
		this._auth.getStorageData().then((response) => {
			this.infoUser = {
				denominacion: response[0],
				unidadMiembroId: response[1],
				ficha: response[2],
				miembro: response[3],
				placa: response[4],
				tramo: response[5],
				esEncargado: response[6],
				accesoTotal: response[7],
				perteneceA: response[8],
				unidadId: response[9],
			};
		});
	}

	ngAfterViewInit(): void {
		setTimeout(() => this.refresh(), 2000);
	}

	handleRefresh(event: any) {
		setTimeout(() => {
			this.refresh();
			event.target.complete();
		}, 2000);
	}

	refreshUserData(): void {
		this._auth
			.refreshUnidadMiembroInfo(this.infoUser?.unidadMiembroId as number)
			.subscribe((data: ILoginUnitResponse) => {
				this._auth.saveToStorage(data).then(() => this.initUserData());
			});
	}

	refresh(): void {
		if (this.infoUser?.ficha && this.infoUser.unidadMiembroId) {
			// this._asistencias.confirmUnidadEstatus(this.infoUser?.ficha)
			this._asistencias.getTotalAsistenciasUnidad(
				this.infoUser?.unidadMiembroId
			);

			this._asistencias.getAsistenciasUnidad(
				this.infoUser?.ficha.toString(),
				this.estatusAsistenciaSelected
			);

			this.checkLocalStorage();
		}
	}

	changeStatus(): void {
		if (this.infoUser?.ficha) {
			const model: IUpdateStatusUnit = { ficha: this.infoUser?.ficha };
			this._asistencias.changeUnidadStatus(model);
		}
	}

	async logout(): Promise<void> {
		if (this.infoUser?.ficha) {
			const model: IUpdateStatusUnit = { ficha: this.infoUser?.ficha };
			await this._auth.logout(model);
		}
	}

	private checkLocalStorage() {
		this.unSentAsistancesSource.next(localStorage.length);
		this.unSentAsistances$.subscribe((value: number) => {
			if (value > 0) {
				for (let index = 0; index < value; index++) {
					const jsonAsistance = localStorage.getItem(`${index}`);
					if (jsonAsistance) {
						const asistanceObj = JSON.parse(
							jsonAsistance
						) as IAsistanceCreate;
						this._asistencias
							.createAsistance(asistanceObj)
							.subscribe((response) => {
								if (response) {
									localStorage.removeItem(`${index}`);
								}
							});
					}
				}
			}
		});
	}

	// sendSavedAsistances() {
	// 	let localStorageCount = localStorage.length;
	// 	if (localStorageCount > 0) {
	// 		const lastIndex = (localStorageCount - 1).toString();
	// 		const asistanceJson = localStorage.getItem(lastIndex);

	// 		const isType1 =
	// 			asistanceJson &&
	// 			this.infoUser?.perteneceA == this.departamento.Asistencia_Vial;

	// 		if (isType1) {
	// 			const newAsistance = JSON.parse(
	// 				asistanceJson
	// 			) as IAsistanceCreate;
	// 			this._asistencias.createAsistance(newAsistance).subscribe(
	// 				async (response: boolean) => {
	// 					if (response) {
	// 						localStorage.removeItem(lastIndex);
	// 						await this.showAlert(response);
	// 					}
	// 				},
	// 				async () => await this.showAlert(false)
	// 			);
	// 		} else {
	// 			// TODO: add pre-hospitalaria
	// 		}

	// 		this.checkLocalStorage();
	// 	}
	// }

	private async showAlert(condition: boolean) {
		const title = condition ? 'Exito' : 'Error';
		const body = condition
			? 'La asistencia se ha enviado correctamente'
			: 'Hubo fallo en el servicio';
		const alert = await this._alert.create({
			header: title,
			message: body,
			backdropDismiss: true,
			animated: true,
		});
		await alert.present();
	}
}
