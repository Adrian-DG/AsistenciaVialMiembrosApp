import { IGenericEnum } from '../../cache/interfaces/igeneric-enum';

export enum PerteneceA {
	Asistencia_Vial = 1,
	Gestion_Operativa,
	Seguridad_Ciudadana,
	Taller,
	Gruas,
	Ambulancia,
}

export const VehicleTypesArray: IGenericEnum[] = [
	{ id: 1, nombre: 'Desconocido' },
	{ id: 2, nombre: 'Autobus' },
	{ id: 3, nombre: 'Camion' },
	{ id: 4, nombre: 'Camioneta' },
	{ id: 5, nombre: 'Carro' },
	{ id: 6, nombre: 'Jeepeta' },
	{ id: 7, nombre: 'Jeep' },
	{ id: 8, nombre: 'Guagua' },
	{ id: 9, nombre: 'Motor o Motocicleta' },
	{ id: 10, nombre: 'Patana' },
];

export const VehicleColors: IGenericEnum[] = [
	{ id: 1, nombre: 'Desconocido' },
	{ id: 2, nombre: 'Amarillo' },
	{ id: 3, nombre: 'Azul' },
	{ id: 4, nombre: 'Blanco' },
	{ id: 5, nombre: 'Crema' },
	{ id: 6, nombre: 'Gris' },
	{ id: 7, nombre: 'Gris Oscuro' },
	{ id: 8, nombre: 'Marron' },
	{ id: 9, nombre: 'Naranja' },
	{ id: 10, nombre: 'Negro' },
	{ id: 11, nombre: 'Rojo' },
	{ id: 12, nombre: 'Rojo Vino' },
	{ id: 13, nombre: 'Verde' },
	{ id: 14, nombre: 'Morado' },
];

export const ProvinciasArray: IGenericEnum[] = [
	{ id: 1, nombre: 'AZUA' },
	{ id: 2, nombre: 'BAHORUCO' },
	{ id: 3, nombre: 'BARAHONA' },
	{ id: 4, nombre: 'DAJABON' },
	{ id: 5, nombre: 'DISTRITO NACIONAL' },
	{ id: 6, nombre: 'DUARTE' },
	{ id: 7, nombre: 'SEIBO' },
	{ id: 8, nombre: 'ELIAS PIÑA' },
	{ id: 9, nombre: 'ESPAILLAT' },
	{ id: 10, nombre: 'HATO MAYOR' },
	{ id: 11, nombre: 'HERMANAS MIRABAL O SALCEDO' },
	{ id: 12, nombre: 'INDEPENDENCIA' },
	{ id: 13, nombre: 'LA ALTAGRACIA' },
	{ id: 14, nombre: 'LA ROMANA' },
	{ id: 15, nombre: 'LA VEGA' },
	{ id: 16, nombre: 'MARIA TRINIDAD SANCHEZ' },
	{ id: 17, nombre: 'MONSEÑOR NOUEL' },
	{ id: 18, nombre: 'MONTE PLATA' },
	{ id: 19, nombre: 'MONTECRISTI' },
	{ id: 20, nombre: 'PEDERNALES' },
	{ id: 21, nombre: 'PERAVIA' },
	{ id: 22, nombre: 'PUERTO PLATA' },
	{ id: 23, nombre: 'SAMANA' },
	{ id: 24, nombre: 'SAN CRISTOBAL' },
	{ id: 25, nombre: 'SAN JOSE DE OCOA' },
	{ id: 26, nombre: 'SAN JUAN' },
	{ id: 27, nombre: 'SAN PEDRO DE MACORIS' },
	{ id: 28, nombre: 'SANCHEZ RAMIREZ' },
	{ id: 29, nombre: 'SANTIAGO' },
	{ id: 30, nombre: 'SANTIAGO RODRIGUEZ' },
	{ id: 31, nombre: 'SANTO DOMINGO' },
	{ id: 32, nombre: 'VALVERDE' },
	{ id: 33, nombre: 'DESCONOCIDA' },
];
