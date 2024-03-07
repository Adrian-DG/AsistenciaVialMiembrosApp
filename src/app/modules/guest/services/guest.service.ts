import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as production } from 'src/environments/environment.prod';
import { environment as development } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { IDataModel } from '../models/idata-model';
import { IStatsFilter } from '../dto/istats-filter';

@Injectable({
	providedIn: 'root',
})
export class GuestService {
	private readonly endPoint = '';

	constructor(private $http: HttpClient, private $router: Router) {
		this.endPoint += isDevMode() ? development.api_url : production.api_url;
	}

	checkIfGuestAuthenticated(): void {
		const value = sessionStorage.getItem('IsAuthenticated');
		if (value) {
			this.$router.navigate(['guest/metrics']);
		}
	}

	confirmGuestAccess(cedula: string): void {
		const params = new HttpParams().set('Cedula', cedula);
		this.$http
			.get<boolean>(`${this.endPoint}/miembros/login-as-guest`, {
				params: params,
			})
			.subscribe((response: boolean) => {
				if (response) {
					sessionStorage.setItem('IsAuthenticated', '1');
					this.$router.navigate(['guest/metrics']);
				}
			});
	}

	private GetStatsParams(filters: IStatsFilter): HttpParams {
		return new HttpParams()
			.set('estatus', filters.estatus)
			.set('initial', filters.initial.toDateString())
			.set('final', filters.final.toDateString());
	}

	getQuienReportaStats(filter: IStatsFilter): Observable<IDataModel[]> {
		const params = this.GetStatsParams(filter);
		return this.$http.get<IDataModel[]>(
			`${this.endPoint}/reportes/reportadoPor`,
			{ params: params }
		);
	}
}
