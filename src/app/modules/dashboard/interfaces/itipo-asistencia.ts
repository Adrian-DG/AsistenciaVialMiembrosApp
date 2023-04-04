export interface ITipoAsistencia {
	id: number;
	nombre: string;
	fechaCreacion: Date;
	fechaModificacion: Date;
	categoriaAsistencia: number;
	estatus: boolean;
	usuarioId: number;
}
