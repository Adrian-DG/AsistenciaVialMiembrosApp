import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenericService } from '../../../generic/services/generic.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';

@Injectable({
	providedIn: 'root',
})
export class AsistanceService extends GenericService {
	constructor(protected override $http: HttpClient, private $router: Router) {
		super($http);
		this.endPoint += '/Asistencias';
	}

	createAsistance(model: IAsistanceCreate): void {
		this.$http
			.post<boolean>(`${this.endPoint}/create`, model)
			.subscribe((response: boolean) => {
				if (response) {
					console.log('Se creo la asistencia');
					this.$router.navigate(['dashboard']);
				}
			});
	}
}
