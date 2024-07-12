export interface ILoginUnitResponse {
	denominacion: string;
	unidadMiembroId: number;
	unidadId: number;
	ficha: string;
	placa: string;
	tramo: string;
	miembroInfo: string;
	token: string;
	esEncargado: boolean;
	estatus: boolean;
	accesoTotal: boolean;
	perteneceA: number;
}
