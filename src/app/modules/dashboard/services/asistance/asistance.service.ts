import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericService } from '../../../generic/services/generic.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';
import { IMetricasViewModel } from '../../interfaces/imetricas-view-model';
import { IAsistenciaEditViewModel } from '../../interfaces/iasistencia-edit-view-model';
import { AlertController } from '@ionic/angular';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';
import { IAsistenciaPreHospitalaria } from '../../interfaces/iasistencia-pre-hospitalaria';

@Injectable({
	providedIn: 'root',
})
export class AsistanceService extends GenericService {
	private asistenciasSource = new BehaviorSubject<IAsistenciaViewModel[]>([]);
	public asistencias$ = this.asistenciasSource.asObservable();

	private tramosSupervisorSource = new BehaviorSubject<IMetricasViewModel[]>(
		[],
	);
	public tramosSupervisor$ = this.tramosSupervisorSource.asObservable();

	private metricasByTramoUnidadSource = new BehaviorSubject<
		IMetricasViewModel[]
	>([]);
	public metricasByTramoUnidad$ =
		this.metricasByTramoUnidadSource.asObservable();

	private metricasByUnidadTipoAsistenciaSource = new BehaviorSubject<
		IMetricasViewModel[]
	>([]);
	public metricasByUnidadTipoAsistencia$ =
		this.metricasByUnidadTipoAsistenciaSource.asObservable();

	private contadorAsistenciasSource =
		new BehaviorSubject<IContadorAsistenciaViewModel>({
			totalAccidentes: 0,
			totalAsistencias: 0,
		});

	public contadorAsistencias$ = this.contadorAsistenciasSource.asObservable();

	private unidadStatusSource = new BehaviorSubject<boolean>(true);
	public unidadStatus$ = this.unidadStatusSource.asObservable();

	constructor(
		protected override $http: HttpClient,
		private $router: Router,
		protected override _alert: AlertController,
	) {
		super($http, _alert);
		this.endPoint += '/asistencias';
	}

	private getNextStorageIndex(): string {
		const numericKeys = Object.keys(localStorage)
			.filter((key) => /^\d+$/.test(key))
			.map((key) => Number(key));

		if (numericKeys.length === 0) {
			return '0';
		}

		return (Math.max(...numericKeys) + 1).toString();
	}

	private notifyRequestError(title: string, message: string): void {
		void this.generateRequestResultAlert(
			title,
			'Ocurrio un error',
			message,
		);
	}

	saveAsistanceToStorage(asistance: IAsistanceCreate) {
		localStorage.setItem(
			this.getNextStorageIndex(),
			JSON.stringify(asistance),
		);
	}

	createAsistance(model: IAsistanceCreate): Observable<boolean> {
		console.log('Creating asistance with model:', model);
		return this.$http.post<boolean>(`${this.endPoint}/create`, model);
	}

	getAsistenciasUnidad(ficha: string, estatus: number): void {
		const params = new HttpParams()
			.set('ficha', ficha)
			.set('estatusAsistencia', estatus);
		this.$http
			.get<IAsistenciaViewModel[]>(`${this.endPoint}/all/filterBy`, {
				params: params,
			})
			.subscribe({
				next: (data: IAsistenciaViewModel[]) =>
					this.asistenciasSource.next(data),
				error: () =>
					this.notifyRequestError(
						'Asistencias',
						'No fue posible obtener las asistencias de la unidad.',
					),
			});
	}

	getTotalAsistenciasUnidad(unidadMiembroId: number): void {
		const params = new HttpParams().set('unidadMiembroId', unidadMiembroId);
		this.$http
			.get<IContadorAsistenciaViewModel>(`${this.endPoint}/contador`, {
				params: params,
			})
			.subscribe({
				next: (data: IContadorAsistenciaViewModel) =>
					this.contadorAsistenciasSource.next(data),
				error: () =>
					this.notifyRequestError(
						'Contador',
						'No fue posible obtener el total de asistencias.',
					),
			});
	}

	getTramosEncargadoSupervisor(
		ficha: string,
		hasSpecialAccess: boolean,
		unidadId: number,
	): void {
		const param = new HttpParams()
			.set('Ficha', ficha)
			.set('AccesoTotal', hasSpecialAccess)
			.set('unidadId', unidadId);
		this.$http
			.get<IMetricasViewModel[]>(`${this.env}/tramos/supervisar`, {
				params: param,
			})
			.subscribe({
				next: (data: IMetricasViewModel[]) =>
					this.tramosSupervisorSource.next(data),
				error: () =>
					this.notifyRequestError(
						'Metricas',
						'No fue posible obtener los tramos a supervisar.',
					),
			});
	}

	getMetricasAsistenciasUnidadByTramo(tramoId: number, ficha: string): void {
		const param = new HttpParams()
			.append('TramoId', tramoId)
			.append('Ficha', ficha);
		this.$http
			.get<IMetricasViewModel[]>(
				`${this.endPoint}/metricas/unidadByTramo`,
				{
					params: param,
				},
			)
			.subscribe({
				next: (data: IMetricasViewModel[]) =>
					this.metricasByTramoUnidadSource.next(data),
				error: () =>
					this.notifyRequestError(
						'Metricas',
						'No fue posible obtener metricas por tramo.',
					),
			});
	}

	getMetricasAsistenciasUnidadByTipo(unidadId: number): void {
		const param = new HttpParams().set('unidadId', unidadId);
		this.$http
			.get<
				IMetricasViewModel[]
			>(`${this.endPoint}/metricas/tipoByUnidad`, { params: param })
			.subscribe({
				next: (data: IMetricasViewModel[]) =>
					this.metricasByUnidadTipoAsistenciaSource.next(data),
				error: () =>
					this.notifyRequestError(
						'Metricas',
						'No fue posible obtener metricas por tipo de asistencia.',
					),
			});
	}

	/* iniciamos la asistencia creada previamente en el centro de operaciones de R5 */

	iniciarAsistenciaR5(id: number, unidadMiembroId: number) {
		return this.$http.put(`${this.endPoint}/iniciar`, {
			Id: id,
			EstatusAsistencia: 2,
			UnidadMiembroId: unidadMiembroId,
		});
	}

	getEditAsistenciaViewModel(
		id: number,
	): Observable<IAsistenciaEditViewModel> {
		return this.$http.get<IAsistenciaEditViewModel>(
			`${this.endPoint}/edit/${id}`,
		);
	}

	confirmUnidadEstatus(ficha: string): void {
		const param = new HttpParams().set('ficha', ficha);
		this.$http
			.get<boolean>(`${this.env}/unidades/confirmStatus`, {
				params: param,
			})
			.subscribe({
				next: (response: boolean) =>
					this.unidadStatusSource.next(response),
				error: () =>
					this.notifyRequestError(
						'Estatus',
						'No fue posible confirmar el estatus de la unidad.',
					),
			});
	}

	changeUnidadStatus(model: IUpdateStatusUnit): void {
		this.$http
			.put<boolean>(`${this.env}/unidades/changeStatus`, model)
			.subscribe({
				next: (response: boolean) => {
					if (response) {
						this.confirmUnidadEstatus(model.ficha);
						void this.generateRequestResultAlert(
							'Cambio de Estatus',
							'Se desea cambiar el estatus de la unidad',
							`El estatus de la unidad ficha ${model.ficha} ha cambiado.`,
						);
						return;
					}

					this.notifyRequestError(
						'Cambio de Estatus',
						'No se pudo cambiar el estatus de la unidad.',
					);
				},
				error: () =>
					this.notifyRequestError(
						'Cambio de Estatus',
						'No se pudo cambiar el estatus de la unidad.',
					),
			});
	}

	guardarCambios(model: IAsistenciaEditViewModel): Observable<boolean> {
		return this.$http.put<boolean>(`${this.endPoint}/edit`, model);
	}

	CreateAsistenciaPreHospitalariaAgente(
		model: IAsistenciaPreHospitalaria,
	): void {
		this.$http
			.post<boolean>(
				`${this.env}/pre-hospitalaria/create-asistencia-agente`,
				model,
			)
			.subscribe({
				next: async (response: boolean) => {
					await this.generateRequestResultAlert(
						response ? 'Ok' : 'Error',
						'',
						response
							? 'Se ha creado la asistencia'
							: 'Ocurrio un error creando la asistencia',
					);
					if (response) {
						this.$router.navigate(['dashboard']);
					}
				},
				error: () =>
					this.notifyRequestError(
						'Error',
						'Ocurrio un error creando la asistencia.',
					),
			});
	}
}
