export interface IAsistenciaPreHospitalaria {
	identificacion: string;
	nombre: string;
	apellido: string;
	sexo: number;
	edad: number;
	telefono: string;
	personaDesconocidad: boolean;
	nacionalidadId: number;
	TipoCausa: number;
	esTraslado: boolean;
	tipoTraslado: number;
	despachadaPor: number;
	apoyoBrindado: number;
	fueEventoCampo: boolean;
	detalleEvento: string;
	zona: number;
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

	miembroCedula: string;
	componente1Cedula: string;
	componente2Cedula: string;
	reguladorEmergenciaCedula: string;
}
