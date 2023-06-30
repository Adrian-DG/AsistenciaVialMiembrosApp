import { ITipoAsistencia } from './itipo-asistencia';

export interface IAsistenciaViewModel {
	id: number;
	// ciudadano
	identificacion: string;
	nombreCiudadano: string;
	genero: string;
	esExtranjero: boolean;
	telefono: string;
	// vehiculo
	vehiculoMarca: string;
	vehiculoModelo: string;
	vehiculoTipo: string;
	vehiculoColor: string;
	placa: string;
	// Ubicacion
	provincia: string;
	municipio: string;
	tramo: string;
	coordenadas: string;
	// unidad
	fichaUnidad: string;
	denominacionUnidad: string;
	tipoUnidad: string;
	//agente
	rangoAgente: string;
	cedulaAgente: string;
	nombreAgente: string;
	// metadata
	reportadaPor: string;
	fechaCreacion: string;
	fechaModificacion: string;
	comentario: string;
	estatusAsistencia: string;
	estatus: boolean;
	esEmergencia: boolean;
	tipoAsistencias: ITipoAsistencia[];

	tieneDatosCompletados: boolean;
}
