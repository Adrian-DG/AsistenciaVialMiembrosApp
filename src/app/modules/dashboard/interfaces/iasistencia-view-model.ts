export interface IAsistenciaViewModel {
	id: number;
	identificacion: string;
	nombreCiudadano: string;
	edad: number;
	telefono: string;
	vehiculoMarca: string;
	vehiculoModelo: string;
	vehiculoTipo: string;
	vehiculoColor: string;
	tipoAsistencia: string;
	categoriaAsistencia: number;
	provincia: string;
	municipio: string;
	tramo: string;
	unidad: string;
	rangoAgente: string;
	cedulaAgente: string;
	nombreAgente: string;
	reportadoPor: string;
	fechaCreacion: string;
	fechaModificacion: string;
	completada: boolean;
}
