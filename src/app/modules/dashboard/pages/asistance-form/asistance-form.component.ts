import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { CacheService } from 'src/app/modules/cache/services/cache.service';
import { IAsistanceCreate } from '../../interfaces/iasistance-create';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { Geolocation } from '@capacitor/geolocation';
import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
	Photo,
} from '@capacitor/camera';
import { ComponentCanDeactivate } from 'src/app/guard/leave.guard';
import { lastValueFrom } from 'rxjs';

import {
	ProvinciasArray,
	VehicleTypesArray,
	VehicleColors,
} from '../../constants/app.const';
import { Router } from '@angular/router';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
})
export class AsistanceFormComponent implements OnInit, ComponentCanDeactivate {
	tipoVehiculosArray = VehicleTypesArray;
	coloresVehiculosArray = VehicleColors;
	provinciasArray = ProvinciasArray;

	wantPictures: boolean = false;

	constructor(
		private $fb: FormBuilder,
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencia: AsistanceService,
		private _alert: AlertController,
		private $router: Router
	) {}

	canDeactivate(): boolean {
		return (
			this.ciudadanoForm.dirty ||
			this.vehiculoForm.dirty ||
			this.ubicacionForm.dirty
		);
	}

	// Cedula: Validators.pattern(/^[0-9]{11,15}$/)
	// Telefono: [Validators.pattern(/^[0-9]{10,15}$/)]

	// private AddCiudadanoIdentificacionValidator(value: boolean): void {
	// 	if (value) {
	// 		this.ciudadanoForm.controls['identificacion'].addValidators([
	// 			Validators.required,
	// 			Validators.minLength(11),
	// 			Validators.maxLength(20),
	// 			Validators.pattern(/^[a-zA-Z0-9]{11,}$/),
	// 		]);
	// 		console.log('validar identificacion: Si');
	// 	} else {
	// 		this.ciudadanoForm.controls['identificacion'].clearValidators();
	// 		this.ciudadanoForm.controls['identificacion'].reset();
	// 		console.log('validar identificacion: No');
	// 	}
	// }

	// private AddCiudadanoTelefonoValidator(value: boolean): void {
	// 	console.log('validar telefono: ', value);
	// 	if (value) {
	// 		this.ciudadanoForm.controls['telefono'].addValidators([
	// 			Validators.required,
	// 			Validators.minLength(10),
	// 			Validators.pattern(/^[0-9]{10,}$/),
	// 		]);
	// 	} else {
	// 		this.ciudadanoForm.controls['telefono'].clearValidators();
	// 		this.ciudadanoForm.controls['telefono'].reset();
	// 	}
	// }

	// private AddVehiculoPlacaValidator(value: boolean): void {
	// 	console.log('validar placa: ', value);
	// 	if (value) {
	// 		this.vehiculoForm.controls['placa'].addValidators([
	// 			Validators.required,
	// 			Validators.minLength(7),
	// 			Validators.pattern(/^[A-Za-z0-9]{1,10}$/),
	// 		]);
	// 	} else {
	// 		this.vehiculoForm.controls['placa'].clearValidators();
	// 		this.vehiculoForm.controls['placa'].reset();
	// 	}
	// }

	ciudadanoForm: FormGroup = this.$fb.group({
		identificacion: [
			'',
			[
				Validators.required,
				Validators.minLength(11),
				Validators.maxLength(20),
				Validators.pattern(/^[a-zA-Z0-9]{11,}$/),
			],
		],
		nombre: [''],
		apellido: [''],
		genero: [1],
		telefono: [
			'',
			[
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(20),
				Validators.pattern(/^[0-9]{10,}$/),
			],
		],
	});

	esExtranjero: boolean = false;

	// Placa: Validators.pattern(/^[A-Za-z0-9]{1,10}$/)
	vehiculoForm: FormGroup = this.$fb.group({
		vehiculoTipoId: [0],
		vehiculoColorId: [0],
		vehiculoModeloId: [0],
		vehiculoMarcaId: [0],
		placa: [
			'',
			[
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(10),
				Validators.pattern(/^[A-Za-z0-9]{1,10}$/),
			],
		],
	});

	ubicacionForm: FormGroup = this.$fb.group({
		municipioId: ['', Validators.required],
		provinciaId: ['', Validators.required],
		direccion: [''],
	});

	imagesWeb: string[] = [];
	imagenes64: string[] = [];
	hasPictures = false;
	hasPosition = false;

	coordenadas: string = '';
	reportadoPor: number = 2;
	categoriaAsistencia: number = 2;
	tipoAsistencias: number[] | number = [];
	comentario: string = '';
	fueCompletada: boolean = true;

	async ngOnInit() {
		await this.getUnitMemberId();

		// this.ciudadanoForm.controls['identificacion'].valueChanges.subscribe(
		// 	(value: string) =>
		// 		this.AddCiudadanoIdentificacionValidator(value.length === 1)
		// );
		// this.ciudadanoForm.controls['telefono'].valueChanges.subscribe(
		// 	(value: string) =>
		// 		this.AddCiudadanoTelefonoValidator(value.length === 1)
		// );
		// this.vehiculoForm.controls['placa'].valueChanges.subscribe(
		// 	(value: string) =>
		// 		this.AddVehiculoPlacaValidator(value.length === 1)
		// );
	}

	async getCurrentPosition(): Promise<void> {
		const position = await Geolocation.getCurrentPosition({
			enableHighAccuracy: true,
		});
		console.log(position);
		this.coordenadas = `${position.coords.latitude}, ${position.coords.longitude}`;
		this.hasPosition = !this.hasPosition;
	}

	private async readAsBase64(photo: Photo) {
		// Fetch the photo, read as a blob, then convert to base64 format
		const response = await fetch(photo.webPath!);
		const blob = await response.blob();

		return (await this.convertBlobToBase64(blob)) as string;
	}

	private convertBlobToBase64 = (blob: Blob) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.readAsDataURL(blob);
		});

	async takePicture() {
		const image = await Camera.getPhoto({
			quality: 100,
			allowEditing: true,
			direction: CameraDirection.Rear,
			resultType: CameraResultType.Uri,
			correctOrientation: true,
			saveToGallery: true,
			source: CameraSource.Camera,
		});

		// image.webPath will contain a path that can be set as an image src.
		// You can access the original file using image.path, which can be
		// passed to the Filesystem API to read the raw data of the image,
		// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
		const imageWeb = image.webPath ?? '';

		const image64 = await this.readAsBase64(image);
		this.imagenes64.unshift(image64);

		this.imagesWeb.unshift(imageWeb);
		this.hasPictures = true;
	}

	showPictureScreen(): void {
		this.wantPictures = !this.wantPictures;
	}

	async getUnitMemberId(): Promise<number> {
		const info = await this._auth.getStorageData();
		return info[1];
	}

	generateAlertMessage(fields: string[]) {
		let finalString = '<ul>';
		fields.forEach((item) => {
			finalString += `<li><b>${item}</b></li>`;
		});

		return `${finalString}</ul>`;
	}

	async confirmCreate(): Promise<void> {
		let emptyOrInvalidFields: string[] = [];

		let forms = [
			this.ciudadanoForm.controls,
			this.vehiculoForm.controls,
			this.ubicacionForm.controls,
		];

		forms.forEach((item) => {
			console.log(item);
			Object.keys(item).forEach((key) => {
				if (
					item[key].value == '' ||
					item[key].value == 0 ||
					item[key].invalid
				) {
					key = key === 'vehiculoTipoId' ? 'Vehiculo Tipo' : key;
					key = key === 'vehiculoColorId' ? 'Color' : key;
					key = key === 'vehiculoMarcaId' ? 'Marca' : key;
					key = key === 'vehiculoModeloId' ? 'Modelo' : key;
					key = key === 'provinciaId' ? 'Provincia' : key;
					key = key === 'municipioId' ? 'Municipio' : key;

					emptyOrInvalidFields.push(key);
				}
			});
		});

		let formatedMessage: string =
			emptyOrInvalidFields.length > 0
				? `Los siguientes campos estan vacios o no seleccionaste una opcion: ${this.generateAlertMessage(
						emptyOrInvalidFields
				  )}`
				: 'Se revisaron todos los campos, y estan completos !!';

		const alert = await this._alert.create({
			header: 'Confirmar reporte de asistencia',
			subHeader: 'Se enviara la siguiente asistencia.',
			message: formatedMessage,
			buttons: [
				{ text: 'cancelar', role: 'cancel' },
				{
					text: 'aceptar',
					role: 'confirm',
					handler: async () => {
						await this.createAsistance();
					},
				},
			],
		});

		await alert.present();
	}

	async createAsistance(): Promise<any> {
		console.log('start creating asistance...');

		const { identificacion, nombre, apellido, genero, telefono } =
			this.ciudadanoForm.value;

		const {
			vehiculoTipoId,
			vehiculoColorId,
			vehiculoMarcaId,
			vehiculoModeloId,
			placa,
		} = this.vehiculoForm.value;

		const { provinciaId, municipioId, direccion } =
			this.ubicacionForm.value;

		if (identificacion === '') {
			this.comentario += '\nNo portaba un documento de identidad.';
		}

		const newAsistencia: IAsistanceCreate = {
			// ciudadano
			identificacion: identificacion,
			nombre: nombre,
			apellido: apellido,
			genero: genero,
			esExtranjero: this.esExtranjero,
			telefono: telefono,
			// vehiculo
			vehiculoColorId: vehiculoColorId,
			vehiculoTipoId: vehiculoTipoId,
			vehiculoMarcaId: vehiculoMarcaId,
			vehiculoModeloId: vehiculoModeloId,
			placa: placa,
			// ubicacion
			provinciaId: provinciaId,
			municipioId: municipioId,
			direccion: direccion,
			comentario: this.comentario,
			coordenadas: this.coordenadas,
			reportadoPor: this.reportadoPor,
			tipoAsistencias: [],
			unidadMiembroId: 0,
			imagenes: this.imagenes64,
			fueCompletada: this.fueCompletada,
		};

		if (typeof this.tipoAsistencias === 'number') {
			newAsistencia.tipoAsistencias = [this.tipoAsistencias as number];
		} else {
			newAsistencia.tipoAsistencias = this.tipoAsistencias as number[];
		}

		newAsistencia.unidadMiembroId = await this.getUnitMemberId();

		this._asistencia
			.createAsistance(newAsistencia)
			.subscribe((response: boolean) => {
				if (response) {
					[
						this.ciudadanoForm,
						this.vehiculoForm,
						this.ubicacionForm,
					].forEach((item) => item.reset());

					this._asistencia.generateRequestResultAlert(
						'Exito',
						'',
						'La asistencia se registro de forma correctamente'
					);

					this.$router.navigate(['dashboard']);
				} else {
					this._asistencia.generateRequestResultAlert(
						'Error',
						'Algo salió mal',
						'No se pudo crear la asistencia, es posible que fue algunos campos no esten correctos o fallara el servicio!!'
					);
				}
			});
	}

	async setStatusReportarAsistencia(): Promise<void> {
		const estatusAlert = await this._alert.create({
			header: 'Estatus de la asistencia',
			subHeader: '¿Como desea reportar la asistencia?',
			message: `1.En curso (sin terminar)
					  </br>
					  2.Completada (terminada)`,
			inputs: [
				{ label: 'En Curso', type: 'radio', value: false },
				{
					label: 'Completadad',
					type: 'radio',
					value: true,
					checked: true,
				},
			],
			animated: true,
			buttons: ['Ok'],
		});

		await estatusAlert.present();

		estatusAlert.onDidDismiss().then((obj) => {
			this.fueCompletada = obj.data.values;
			this.confirmCreate();
		});
	}
}
