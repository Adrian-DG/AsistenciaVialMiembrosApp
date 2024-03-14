export interface IAsistenciaPreHospitalaria {
	identificacion: string;
	nombre: string;
	apellido: string;
	sexo: number;
	edad: number;
	telefono: string;
	personaDesconocidad: boolean;
	nacionalidadId: number;
	tipoAsistencia: number;
	tipoCausa: number;
	esTraslado: boolean;
	causaTraslado: number;
	despachadaPor: number;
	apoyoBrindado: number;
	esEventoCampo: boolean;
	esEventoEspecial: boolean;
	detalleEventoEspecial: string;
	zona: number;
	provinciaId: number;
	municipioId: number;
	unidadId: number;
	denominacionId: number;
	hospitalId: number;
	personaRecibioEnHospital: string;
	AntecedentesMorbidos: string;
	detalleAsistencia: string;
	frecuenciaCardiaca: number;
	frecuenciaRespiratoria: number;
	tensionArterialSistolica: number;
	tensionArterialDiastolica: number;
	saturacionParcialOxigeno: number;
	temperatura: number;

	LlenadoCapilar: number;
	aperturaOcular: number;
	respuestaVerbal: number;
	respuestaMotora: number;

	hallazgoPositivo: string;
	diagnosticoPresuntivo: string;
	procedimientosRealizados: string;
	insumosUtilizados: string;

	medicoId: number;
	componente1Id: number;
	componente2Id: number;
	reguladorEmergenciaId: number;
}
