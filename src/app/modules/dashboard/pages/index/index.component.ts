import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';
import { PerteneceA } from '../../constants/app.const';
import { ILoginUnitResponse } from 'src/app/modules/auth/interfaces/ilogin-unit-response';
import { BehaviorSubject } from 'rxjs';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterViewInit {
	private static readonly REFRESH_DELAY_MS = 2000;

	infoUser: IMemberUnitInfo | null = null;

	estatusAsistenciaSelected: number = 1;

	public departamento = PerteneceA;

	private unSentAsistancesSource = new BehaviorSubject<number>(0);
	public unSentAsistances$ = this.unSentAsistancesSource.asObservable();

	constructor(
		private _auth: AuthService,
		public _asistencias: AsistanceService,
	) {}

	ngOnInit() {
		this.initUserData();
		this.updatePendingAsistancesCount();
		this.syncPendingAsistances();
	}

	initUserData(): void {
		this._auth.getStorageData().then((response) => {
			const [
				denominacion,
				unidadMiembroId,
				ficha,
				miembro,
				placa,
				tramo,
				esEncargado,
				accesoTotal,
				perteneceA,
				unidadId,
			] = response;

			this.infoUser = {
				denominacion,
				unidadMiembroId,
				ficha,
				miembro,
				placa,
				tramo,
				esEncargado,
				accesoTotal,
				perteneceA,
				unidadId,
			};
		});
	}

	ngAfterViewInit(): void {
		setTimeout(() => this.refresh(), IndexComponent.REFRESH_DELAY_MS);
	}

	handleRefresh(event: Event): void {
		setTimeout(() => {
			this.refresh();
			(event.target as HTMLIonRefresherElement | null)?.complete();
		}, IndexComponent.REFRESH_DELAY_MS);
	}

	refreshUserData(): void {
		if (!this.infoUser?.unidadMiembroId) {
			return;
		}

		this._auth
			.refreshUnidadMiembroInfo(this.infoUser.unidadMiembroId)
			.subscribe((data: ILoginUnitResponse) => {
				this._auth
					.saveToStorage(data)
					.then(() => this.initUserData())
					.finally(() => this.refresh());
			});
	}

	refresh(): void {
		if (this.infoUser?.ficha && this.infoUser.unidadMiembroId) {
			// this._asistencias.confirmUnidadEstatus(this.infoUser?.ficha)
			this._asistencias.getTotalAsistenciasUnidad(
				this.infoUser?.unidadMiembroId,
			);

			this._asistencias.getAsistenciasUnidad(
				this.infoUser?.ficha.toString(),
				this.estatusAsistenciaSelected,
			);

			this.syncPendingAsistances();
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

	private updatePendingAsistancesCount(): void {
		this.unSentAsistancesSource.next(localStorage.length);
	}

	private syncPendingAsistances(): void {
		const pendingKeys = this.getPendingAsistanceKeys();
		this.unSentAsistancesSource.next(pendingKeys.length);

		if (pendingKeys.length === 0) {
			return;
		}

		for (const key of pendingKeys) {
			const jsonAsistance = localStorage.getItem(key);
			if (!jsonAsistance) {
				continue;
			}

			const asistanceObj = JSON.parse(jsonAsistance) as IAsistanceCreate;
			this._asistencias
				.createAsistance(asistanceObj)
				.pipe(take(1))
				.subscribe((response) => {
					if (response) {
						localStorage.removeItem(key);
						this.unSentAsistancesSource.next(localStorage.length);
					}
				});
		}
	}

	private getPendingAsistanceKeys(): string[] {
		return Object.keys(localStorage).filter((key) => /^\d+$/.test(key));
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
}
