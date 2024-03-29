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
import { SpinnerService } from 'src/app/modules/generic/services/spinner/spinner.service';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';
import { IGenericEnum } from 'src/app/modules/cache/interfaces/igeneric-enum';
import { IAsistenciaPreHospitalaria } from '../../interfaces/iasistencia-pre-hospitalaria';

@Injectable({
	providedIn: 'root',
})
export class AsistanceService extends GenericService {
	private asistenciasSource = new BehaviorSubject<IAsistenciaViewModel[]>([]);
	public asistencias$ = this.asistenciasSource.asObservable();

	private tramosSupervisorSource = new BehaviorSubject<IMetricasViewModel[]>(
		[]
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
		private _spinner: SpinnerService,
		protected override _alert: AlertController
	) {
		super($http, _alert);
		this.endPoint += '/asistencias';
	}

	createAsistance(model: IAsistanceCreate): Observable<boolean> {
		console.log('Enter asistance service');
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
			.subscribe((data: IAsistenciaViewModel[]) => {
				console.log(data);
				this.asistenciasSource.next(data);
			});
	}

	getTotalAsistenciasUnidad(unidadMiembroId: number): void {
		const params = new HttpParams().set('unidadMiembroId', unidadMiembroId);
		this.$http
			.get<IContadorAsistenciaViewModel>(`${this.endPoint}/contador`, {
				params: params,
			})
			.subscribe((data: IContadorAsistenciaViewModel) =>
				this.contadorAsistenciasSource.next(data)
			);
	}

	getTramosEncargadoSupervisor(
		ficha: string,
		hasSpecialAccess: boolean
	): void {
		const param = new HttpParams()
			.set('Ficha', ficha)
			.set('AccesoTotal', hasSpecialAccess);
		this.$http
			.get<IMetricasViewModel[]>(`${this.env}/tramos/supervisar`, {
				params: param,
			})
			.subscribe((data: IMetricasViewModel[]) => {
				console.log(data);
				this.tramosSupervisorSource.next(data);
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
				}
			)
			.subscribe((data: IMetricasViewModel[]) =>
				this.metricasByTramoUnidadSource.next(data)
			);
	}

	getMetricasAsistenciasUnidadByTipo(unidadId: number): void {
		const param = new HttpParams().set('unidadId', unidadId);
		this.$http
			.get<IMetricasViewModel[]>(
				`${this.endPoint}/metricas/tipoByUnidad`,
				{ params: param }
			)
			.subscribe((data: IMetricasViewModel[]) =>
				this.metricasByUnidadTipoAsistenciaSource.next(data)
			);
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
		id: number
	): Observable<IAsistenciaEditViewModel> {
		return this.$http.get<IAsistenciaEditViewModel>(
			`${this.endPoint}/edit/${id}`
		);
	}

	confirmUnidadEstatus(ficha: string): void {
		const param = new HttpParams().set('ficha', ficha);
		this.$http
			.get<boolean>(`${this.env}/unidades/confirmStatus`, {
				params: param,
			})
			.subscribe((response: boolean) =>
				this.unidadStatusSource.next(response)
			);
	}

	changeUnidadStatus(model: IUpdateStatusUnit): void {
		this.$http
			.put<boolean>(`${this.env}/unidades/changeStatus`, model)
			.subscribe((respose: boolean) => {
				if (respose) {
					this.confirmUnidadEstatus(model.ficha);
				}
				this.generateRequestResultAlert(
					'Cambio de Estatus',
					'Se desea cambiar el estatus de la unidad',
					`El estatus de la unidad ficha ${model.ficha} ha cambiado.`
				);
			});
	}

	guardarCambios(model: IAsistenciaEditViewModel): Observable<boolean> {
		return this.$http.put<boolean>(`${this.endPoint}/edit`, model);
	}

	CreateAsistenciaPreHospitalariaAgente(
		model: IAsistenciaPreHospitalaria
	): void {
		this.$http
			.post<boolean>(
				`${this.env}/pre-hospitalaria/create-asistencia-agente`,
				model
			)
			.subscribe(async (response: boolean) => {
				await this.generateRequestResultAlert(
					response ? 'Ok' : 'Error',
					'',
					response
						? 'Se ha creado la asistencia'
						: 'Ocurrio un error creando la asistencia'
				);
				if (response) {
					this.$router.navigate(['']);
				}
			});
	}
}
