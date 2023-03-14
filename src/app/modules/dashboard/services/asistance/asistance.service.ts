import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GenericService } from '../../../generic/services/generic.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';

@Injectable({
	providedIn: 'root',
})
export class AsistanceService extends GenericService {
	private asistenciasSource = new BehaviorSubject<IAsistenciaViewModel[]>([]);
	public asistencias$ = this.asistenciasSource.asObservable();

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
}
