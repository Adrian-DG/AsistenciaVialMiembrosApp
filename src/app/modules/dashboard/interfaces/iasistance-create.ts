export interface IAsistanceCreate {
	identificacion: string;
	nombreCiudadano: string;
	edad: number;
	telefono: string;
	vehiculoTipoId: number;
	vehiculoColorId: number;
	vehiculoModeloId: number;
	vehiculoMarcaId: number;
	latitud: string;
	longitud: string;
	municipioId: number;
	provinciaId: number;
	unidadMiembroId: number;
	tipoAsistenciaId: number;
	comentarios: string;
	reportadoPor: number;
}
