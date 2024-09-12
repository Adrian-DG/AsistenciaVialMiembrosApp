export interface IVehiculosInvolucrados {
	vehiculoTipoId: number;
	vehiculoColorId: number;
	vehiculoMarcaId: number;
	marcaTxt: string;
	vehiculoModeloId: number;
	modeloTxt: string;
	placa: string;
}

export interface IManiobrasAplicadasRescate {
	postesLadoDerecho: number;
	postesLadoIzquierdo: number;
	deplazamientoTablero: number;
	puertaLadoDerecho: number;
	puertaLadoIzquierdo: number;
	usoEstabilizadores: boolean;
	desmonteParabrisasDelantero: boolean;
	desmonteParabrisasTrasero: boolean;
}

export interface IAsistenciaRescateCreate {
	tipoDocumento: number;
	identificacion: string;
	nombre: string;
	apellido: string;
	edad: number;
	sexo: number;
	telefono: string;
	nacionalidadId: number;
	tipoAsistencia: number;
	condicionVictima: number;
	cantidadPersonasLesionadas: number;
	cantidadPersonasFallecidas: number;
	entidadRecibioVictima: number;
	entidadRecibioPertenencias: number;
	cantidadVehiculos: number;
	vehiculosInvolucrados: IVehiculosInvolucrados[];
	maniobrasAplicadas: IManiobrasAplicadasRescate[];
	detalles: string;
	unidadId: number;
	unidadMiembroId: number;
	provinciaId: number;
	municipioId: number;
}
