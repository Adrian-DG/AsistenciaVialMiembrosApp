import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../../generic/services/generic.service';
import { IGenericEnum } from '../interfaces/igeneric-enum';

@Injectable({
	providedIn: 'root',
})
export class CacheService extends GenericService {
	constructor(protected override $http: HttpClient) {
		super($http);
		this.endPoint += '/cache';
	}

	getRangos(): Observable<IGenericEnum[]> {
		return this.$http.get<IGenericEnum[]>(`${this.endPoint}/rangos`);
	}
}
