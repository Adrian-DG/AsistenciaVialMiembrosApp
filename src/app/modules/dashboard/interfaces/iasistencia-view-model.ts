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
	// metadata
	fechaCreacion: string;
	comentario: string;
	tipoAsistencias: ITipoAsistencia[];
	estatusAsistencia: string;
	estatus: boolean;
}
