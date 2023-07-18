import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';
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
import { Observable } from 'rxjs';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
})
export class AsistanceFormComponent implements OnInit, ComponentCanDeactivate {
	wantPictures: boolean = false;

	constructor(
		private $fb: FormBuilder,
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencia: AsistanceService,
		private _alert: AlertController
	) {}

	public canDeactivate(): boolean {
		return (
			this.ciudadanoForm.dirty ||
			this.vehiculoForm.dirty ||
			this.ubicacionForm.dirty
		);
	}

	ciudadanoForm: FormGroup = this.$fb.group({
		identificacion: ['', Validators.pattern(/^[0-9]{11,15}$/)],
		nombre: [''],
		apellido: [''],
		genero: [0],
		esExtranjero: [false],
		telefono: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
	});

	vehiculoForm: FormGroup = this.$fb.group({
		vehiculoTipoId: [0],
		vehiculoColorId: [0],
		vehiculoModeloId: [0],
		vehiculoMarcaId: [0],
		placa: ['', Validators.pattern(/^[A-Za-z0-9]{1,10}$/)],
	});

	ubicacionForm: FormGroup = this.$fb.group({
		municipioId: [0],
		provinciaId: [0],
		direccion: [''],
	});

	imagesWeb: string[] = [];
	imagenes64: string[] = [];
	hasPictures = false;
	hasPosition = false;

	coordenadas: string = '';
	reportadoPor: number = 0;
	tipoAsistencias: number[] = [];
	comentario: string = '';

	async ngOnInit() {
		await this.getUnitMemberId();
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
			finalString += `<li>${item}</li>`;
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
			Object.keys(item).forEach((key) => {
				if (
					item[key].invalid ||
					item[key].value == '' ||
					item[key].value == 0
				) {
					emptyOrInvalidFields.push(key);
				}
			});
		});

		let formatedMessage: string =
			emptyOrInvalidFields.length == 0
				? 'Se revisaron todos los campos, y estan completos !!'
				: `Los siguientes campos estan vacios o no seleccionaste una opcion: ${this.generateAlertMessage(
						emptyOrInvalidFields
				  )}`;

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

		this._asistencia.setCanleaveSource(true);

		const {
			identificacion,
			nombre,
			apellido,
			genero,
			esExtranjero,
			telefono,
		} = this.ciudadanoForm.value;

		const {
			vehiculoTipoId,
			vehiculoColorId,
			vehiculoMarcaId,
			vehiculoModeloId,
			placa,
		} = this.vehiculoForm.value;

		const { provinciaId, municipioId, direccion } =
			this.ubicacionForm.value;

		const newAsistencia: IAsistanceCreate = {
			// ciudadano
			identificacion: identificacion,
			nombre: nombre,
			apellido: apellido,
			genero: genero,
			esExtranjero: esExtranjero,
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
			tipoAsistencias: this.tipoAsistencias,
			unidadMiembroId: 0,
			imagenes: this.imagenes64,
		};

		newAsistencia.unidadMiembroId = await this.getUnitMemberId();

		this._asistencia.createAsistance(newAsistencia);
	}
}
