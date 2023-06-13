import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericService } from '../../../generic/services/generic.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';
import { IGenericEnum } from 'src/app/modules/cache/interfaces/igeneric-enum';
import { IMetricasViewModel } from '../../interfaces/imetricas-view-model';
import { IAsistenciaEditViewModel } from '../../interfaces/iasistencia-edit-view-model';
import { AlertController } from '@ionic/angular';
import { SpinnerService } from 'src/app/modules/generic/services/spinner/spinner.service';
import { IUpdateStatusUnit } from '../../interfaces/iupdate-status-unit';

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

	private unidadStatusSource = new BehaviorSubject<boolean>(true);
	public unidadStatus$ = this.unidadStatusSource.asObservable();

	constructor(
		protected override $http: HttpClient,
		private $router: Router,
		private _alert: AlertController,
		private _spinner: SpinnerService
	) {
		super($http);
		this.endPoint += '/asistencias';
	}

	private async generateRequestResultAlert(
		header: string,
		subHeader: string,
		message: string
	): Promise<void> {
		const alert = await this._alert.create({
			header: header,
			subHeader: subHeader,
			message: message,
			buttons: ['ok'],
			animated: true,
		});
		await alert.present();
	}

	createAsistance(model: IAsistanceCreate): void {
		console.log('Enter asistance service');
		this.$http.post<boolean>(`${this.endPoint}/create`, model).subscribe(
			(response: boolean) => {
				if (response) {
					this.generateRequestResultAlert(
						'Exito',
						'',
						'La asistencia se registro de forma correctamente'
					);
					this.$router.navigate(['dashboard']);
				}
			},
			(error) =>
				this.generateRequestResultAlert(
					'Error',
					'',
					'Algo salio, no se pudo crear la asistencia!!'
				)
		);
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

	guardarCambios(model: IAsistenciaEditViewModel): void {
		this.$http.put<boolean>(`${this.endPoint}/edit`, model).subscribe(
			(response: boolean) => {
				if (response) {
					this.generateRequestResultAlert(
						'Ok',
						'',
						'Se guardaron los cambios'
					);
					this.$router.navigate(['dashboard']);
				}
			},
			(error) =>
				this.generateRequestResultAlert(
					'Error',
					'',
					'Algo salio al guardar los cambios'
				)
		);
	}
}
