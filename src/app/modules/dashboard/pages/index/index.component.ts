import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';
import { PerteneceA } from '../../constants/app.const';
import { ILoginUnitResponse } from 'src/app/modules/auth/interfaces/ilogin-unit-response';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
	private static readonly REFRESH_DELAY_MS = 2000;
	private static readonly SYNC_INTERVAL_MS = 600_000; // 10 minutes
	private static readonly PENDING_SEND_INTERVAL_MS = 60_000; // 1 minute

	private syncInterval: ReturnType<typeof setInterval> | null = null;
	private pendingSendTimeout: ReturnType<typeof setTimeout> | null = null;
	private connectionSubscription: Subscription | null = null;
	public isPendingSendInProgress = false;
	public isWaitingForConnection = false;
	public isManualPendingSendLocked = false;

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
		this.syncPendingAsistances();
		this.connectionSubscription = this._asistencias.isConnected$.subscribe(
			(isConnected) => {
				if (!isConnected) {
					if (this.isManualPendingSendLocked) {
						this.isWaitingForConnection =
							this.getPendingAsistanceKeys().length > 0;
					}
					return;
				}

				this.isWaitingForConnection = false;
				if (
					this.isManualPendingSendLocked ||
					this.getPendingAsistanceKeys().length > 0
				) {
					this.processNextPendingAsistance();
				}
			},
		);
		this.syncInterval = setInterval(
			() => this.syncPendingAsistances(),
			IndexComponent.SYNC_INTERVAL_MS,
		);
	}

	ngOnDestroy(): void {
		if (this.syncInterval !== null) {
			clearInterval(this.syncInterval);
		}

		if (this.pendingSendTimeout !== null) {
			clearTimeout(this.pendingSendTimeout);
		}

		if (this.connectionSubscription !== null) {
			this.connectionSubscription.unsubscribe();
		}
	}

	initUserData(): Promise<void> {
		return this._auth.getStorageData().then((response) => {
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

	async refreshUserData(): Promise<void> {
		if (!this.infoUser?.unidadMiembroId) {
			await this.initUserData();
		}

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

	private syncPendingAsistances(): void {
		const pendingKeys = this.getPendingAsistanceKeys();
		this.unSentAsistancesSource.next(pendingKeys.length);

		if (pendingKeys.length === 0) {
			return;
		}

		this.processNextPendingAsistance();
	}

	private getPendingAsistanceKeys(): string[] {
		return Object.keys(localStorage).filter((key) => /^\d+$/.test(key));
	}

	sendPendingAsistencias(): void {
		if (this.isManualPendingSendLocked || this.isPendingSendInProgress) {
			return;
		}

		const pendingKeys = this.getPendingAsistanceKeys();
		if (pendingKeys.length === 0) {
			return;
		}

		this.isManualPendingSendLocked = true;
		this.unSentAsistancesSource.next(pendingKeys.length);
		this.processNextPendingAsistance();
	}

	getPendingSendButtonLabel(
		unSentAsistances: number,
		isConnected: boolean | null,
	): string {
		if (this.isPendingSendInProgress) {
			return 'Enviando pendientes...';
		}

		if (this.isWaitingForConnection || !isConnected) {
			return 'Esperando conexion...';
		}

		return `Enviar pendientes: ${unSentAsistances || 0}`;
	}

	private processNextPendingAsistance(): void {
		if (this.isPendingSendInProgress || this.pendingSendTimeout !== null) {
			return;
		}

		const pendingKeys = this.getPendingAsistanceKeys();
		this.unSentAsistancesSource.next(pendingKeys.length);

		if (pendingKeys.length === 0) {
			this.isWaitingForConnection = false;
			this.isManualPendingSendLocked = false;
			return;
		}

		this._asistencias.isConnected$
			.pipe(take(1))
			.subscribe((isConnected) => {
				if (!isConnected) {
					this.isWaitingForConnection = true;
					return;
				}

				this.isWaitingForConnection = false;

				const key = this.getPendingAsistanceKeys()[0];
				if (!key) {
					return;
				}

				const jsonAsistance = localStorage.getItem(key);
				if (!jsonAsistance) {
					localStorage.removeItem(key);
					this.unSentAsistancesSource.next(
						this.getPendingAsistanceKeys().length,
					);
					this.processNextPendingAsistance();
					return;
				}

				let asistanceObj: IAsistanceCreate;
				try {
					asistanceObj = JSON.parse(
						jsonAsistance,
					) as IAsistanceCreate;
				} catch {
					localStorage.removeItem(key);
					this.unSentAsistancesSource.next(
						this.getPendingAsistanceKeys().length,
					);
					this.processNextPendingAsistance();
					return;
				}

				this.isPendingSendInProgress = true;
				this._asistencias
					.createAsistance(asistanceObj)
					.pipe(take(1))
					.subscribe({
						next: (response) => {
							if (response) {
								localStorage.removeItem(key);
							}
						},
						complete: () => {
							this.isPendingSendInProgress = false;
							const pendingCount =
								this.getPendingAsistanceKeys().length;
							this.unSentAsistancesSource.next(pendingCount);

							if (pendingCount === 0) {
								this.isWaitingForConnection = false;
								this.isManualPendingSendLocked = false;
								return;
							}

							this.scheduleNextPendingAsistance();
						},
						error: () => {
							this.isPendingSendInProgress = false;
							this.scheduleNextPendingAsistance();
						},
					});
			});
	}

	private scheduleNextPendingAsistance(): void {
		if (this.pendingSendTimeout !== null) {
			return;
		}

		if (this.getPendingAsistanceKeys().length === 0) {
			return;
		}

		this.pendingSendTimeout = setTimeout(() => {
			this.pendingSendTimeout = null;
			this.processNextPendingAsistance();
		}, IndexComponent.PENDING_SEND_INTERVAL_MS);
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
