import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from '../../../generic/services/generic.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';
import { IGenericEnum } from 'src/app/modules/cache/interfaces/igeneric-enum';
import { IMetricasViewModel } from '../../interfaces/imetricas-view-model';

@Injectable({
	providedIn: 'root',
})
export class AsistanceService extends GenericService {
	private asistenciasSource = new BehaviorSubject<IAsistenciaViewModel[]>([]);
	public asistencias$ = this.asistenciasSource.asObservable();

	private tramosSupervisorSource = new BehaviorSubject<IGenericEnum[]>([]);
	public tramosSupervisor$ = this.tramosSupervisorSource.asObservable();

	private metricasByTramoUnidadSource = new BehaviorSubject<
		IMetricasViewModel[]
	>([]);
	public metricasByTramoUnidad$ =
		this.metricasByTramoUnidadSource.asObservable();

	private contadorAsistenciasSource =
		new BehaviorSubject<IContadorAsistenciaViewModel>({
			totalAccidentes: 0,
			totalAsistencias: 0,
		});
	public contadorAsistencias$ = this.contadorAsistenciasSource.asObservable();

	constructor(protected override $http: HttpClient, private $router: Router) {
		super($http);
		this.endPoint += '/asistencias';
	}

	createAsistance(model: IAsistanceCreate): void {
		console.log('Enter asistance service');
		this.$http
			.post<boolean>(`${this.endPoint}/create`, model)
			.subscribe((response: boolean) => {
				if (response) {
					console.log('Se creo la asistencia');
					this.$router.navigate(['dashboard']);
				}
			});
	}

	getAsistenciasUnidad(ficha: string): void {
		// const params = new HttpParams().set('ficha', ficha);
		this.$http
			.get<IAsistenciaViewModel[]>(`${this.endPoint}/all/${ficha}`)
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

	getTramosEncargadoSupervisor(ficha: string): void {
		const param = new HttpParams().set('ficha', ficha);
		this.$http
			.get<IGenericEnum[]>(`${this.env}/tramos/supervisar`, {
				params: param,
			})
			.subscribe((data: IGenericEnum[]) => {
				this.tramosSupervisorSource.next(data);
			});
	}

	getMetricasAsistenciasUnidadByTramo(tramoId: number): void {
		const param = new HttpParams().set('tramoId', tramoId);
		this.$http
			.get<IMetricasViewModel[]>(`${this.endPoint}/metricas`, {
				params: param,
			})
			.subscribe((data: IMetricasViewModel[]) =>
				this.metricasByTramoUnidadSource.next(data)
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
}
