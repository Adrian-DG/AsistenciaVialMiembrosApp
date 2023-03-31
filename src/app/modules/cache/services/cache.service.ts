import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericService } from '../../generic/services/generic.service';
import { IGenericEnum } from '../interfaces/igeneric-enum';

@Injectable({
	providedIn: 'root',
})
export class CacheService extends GenericService {
	private vehiculoTiposSource = new BehaviorSubject<IGenericEnum[]>([]);
	public vehiculoTipos$ = this.vehiculoTiposSource.asObservable();

	private vehiculoColoresSource = new BehaviorSubject<IGenericEnum[]>([]);
	public vehiculoColor$ = this.vehiculoColoresSource.asObservable();

	private vehiculoMarcaSource = new BehaviorSubject<IGenericEnum[]>([]);
	public vehiculoMarca$ = this.vehiculoMarcaSource.asObservable();

	private vehiculoModeloSource = new BehaviorSubject<IGenericEnum[]>([]);
	public vehiculoModelo$ = this.vehiculoModeloSource.asObservable();

	private provinciaSource = new BehaviorSubject<IGenericEnum[]>([]);
	public provincias$ = this.provinciaSource.asObservable();

	private municipiosSource = new BehaviorSubject<IGenericEnum[]>([]);
	public municipios$ = this.municipiosSource.asObservable();

	private tipoAsistenciaSource = new BehaviorSubject<IGenericEnum[]>([]);
	public tipoAsistencia$ = this.tipoAsistenciaSource.asObservable();

	private rangosSource = new BehaviorSubject<IGenericEnum[]>([]);
	public rangos$ = this.rangosSource.asObservable();

	private readonly sources = {
		VehiculoTipo: (value: IGenericEnum[]) =>
			this.vehiculoTiposSource.next(value),
		VehiculoColores: (value: IGenericEnum[]) =>
			this.vehiculoColoresSource.next(value),
		VehiculoMarca: (value: IGenericEnum[]) =>
			this.vehiculoMarcaSource.next(value),
		VehiculoModelo: (value: IGenericEnum[]) =>
			this.vehiculoModeloSource.next(value),
		provincias: (value: IGenericEnum[]) => this.provinciaSource.next(value),
		municipios: (value: IGenericEnum[]) =>
			this.municipiosSource.next(value),
		TipoAsistencia: (value: IGenericEnum[]) =>
			this.tipoAsistenciaSource.next(value),
		rangos: (value: IGenericEnum[]) => this.rangosSource.next(value),
	};

	constructor(protected override $http: HttpClient) {
		super($http);
		this.endPoint += '/cache';
	}

	getResource(resource: string): void {
		const sourcesKeys = Object.entries(this.sources);
		console.log(resource);
		this.$http
			.get<IGenericEnum[]>(`${this.endPoint}/${resource}`)
			.subscribe((data: IGenericEnum[]) => {
				console.log(data);
				const key = sourcesKeys.findIndex((x) => x[0] == resource);
				console.log(key);
				console.log(sourcesKeys[key]);
				sourcesKeys[key][1](data);
			});
	}

	getResourceById(resource: string, id: number): void {
		const params = new HttpParams().set('id', id);
		const sourcesKeys = Object.entries(this.sources);
		console.log(resource);
		this.$http
			.get<IGenericEnum[]>(`${this.endPoint}/${resource}`, {
				params: params,
			})
			.subscribe((data: IGenericEnum[]) => {
				console.log(data);
				const key = sourcesKeys.findIndex((x) => x[0] == resource);
				console.log(key);
				console.log(sourcesKeys[key]);
				sourcesKeys[key][1](data);
			});
	}
}
