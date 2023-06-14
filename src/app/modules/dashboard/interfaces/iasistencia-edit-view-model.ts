export interface IAsistenciaEditViewModel {
	id: number;
	identificacion: string;
	nombre: string;
	apellido: string;
	telefono: string;
	genero: number;
	placa: string;
	vehiculoTipoId: number;
	vehiculoColorId: number;
	vehiculoModeloId: number;
	vehiculoMarcaId: number;
	provinciaId: number;
	municipioId: number;
	direccion: string;
	tipoAsistencias: number[];
	comentario: string;
}
