export interface IAsistanceCreate {
	identificacion: string;
	nombre: string;
	apellido: string;
	genero: number;
	esExtranjero: boolean;
	telefono: string;
	vehiculoTipoId: number;
	vehiculoColorId: number;
	vehiculoModeloId: number;
	vehiculoMarcaId: number;
	placa: string;
	coordenadas: string;
	municipioId: number;
	provinciaId: number;
	unidadMiembroId: number;
	imagenes: string[];
	tipoAsistencias: number[];
	comentario: string;
	reportadoPor: number;
}
