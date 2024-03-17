import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericService } from '../../generic/services/generic.service';
import { IGenericEnum } from '../interfaces/igeneric-enum';
import { AlertController } from '@ionic/angular';

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

	private hospitalesSource = new BehaviorSubject<IGenericEnum[]>([]);
	public hospitales$ = this.hospitalesSource.asObservable();

	private nacionalidadesSource = new BehaviorSubject<IGenericEnum[]>([]);
	public nacionalidades$ = this.nacionalidadesSource.asObservable();

	private miembrosPreHospitalariaSource = new BehaviorSubject<IGenericEnum[]>(
		[]
	);
	public miembrosPreHospitalaria$ =
		this.miembrosPreHospitalariaSource.asObservable();

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
		hospitales: (value: IGenericEnum[]) =>
			this.hospitalesSource.next(value),
		nacionalidades: (value: IGenericEnum[]) =>
			this.nacionalidadesSource.next(value),
		filter_provicias: (value: IGenericEnum[]) =>
			this.provinciaSource.next(value),
	};

	constructor(
		protected override $http: HttpClient,
		protected override _alert: AlertController
	) {
		super($http, _alert);
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

	getDataOnIdFilters(resource: string, tipo: number, marca: number): void {
		const params = new HttpParams().set('tipo', tipo).set('marca', marca);
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

	GetMiembrosPreHospitalaria(): void {
		if (!(this.miembrosPreHospitalariaSource.value.length > 0)) {
			this.$http
				.get<IGenericEnum[]>(
					`${this.env}/miembros/miembros-pre-hospitalaria`
				)
				.subscribe((data: IGenericEnum[]) =>
					this.miembrosPreHospitalariaSource.next(data)
				);
		}
	}
}
