import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal } from '@ionic/angular';
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

import {
	ProvinciasArray,
	VehicleTypesArray,
	VehicleColors,
} from '../../constants/app.const';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-asistance-form',
	templateUrl: './asistance-form.component.html',
	styleUrls: ['./asistance-form.component.scss'],
	providers: [DatePipe],
})
export class AsistanceFormComponent implements OnInit, ComponentCanDeactivate {
	tipoVehiculosArray = VehicleTypesArray;
	coloresVehiculosArray = VehicleColors;
	provinciasArray = ProvinciasArray;

	wantPictures: boolean = false;
	hasPersonalInformation = true;
	hasVehicleInformation = true;

	solicitoApoyo = false;
	unidadAlfaId!: number | null;

	@ViewChild('citizenSignatureModal', { static: false })
	citizenModal!: IonModal;
	@ViewChild('soldierSignatureModal', { static: false })
	soldierModal!: IonModal;

	constructor(
		private $fb: FormBuilder,
		public _cache: CacheService,
		private _auth: AuthService,
		private _asistencia: AsistanceService,
		private _alert: AlertController,
		private $router: Router,
		private _datePipe: DatePipe,
	) {}

	get isMainFormValid(): boolean {
		return (
			this.ciudadanoForm.valid &&
			this.vehiculoForm.valid &&
			this.ubicacionForm.valid
		);
	}

	canDeactivate(): boolean {
		return (
			this.ciudadanoForm.dirty ||
			this.vehiculoForm.dirty ||
			this.ubicacionForm.dirty
		);
	}

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
		colorTxt: [''],
		marcaTxt: [''],
		modeloTxt: [''],
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

	tiempoLlegada: string | null = this.getMyCountryDateTime();

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

	isCitizenSignatureCapture = false;
	isSoldierSignatureCapture = false;

	private isTiempoLLegadaRegistradoSubject = new BehaviorSubject<boolean>(
		false,
	);
	isTiempoLLegadaRegistrado$ =
		this.isTiempoLLegadaRegistradoSubject.asObservable();

	setTiempoLlegada(): void {
		this.tiempoLlegada = this.getMyCountryDateTime();
		this.isTiempoLLegadaRegistradoSubject.next(true);
	}

	async ngOnInit(): Promise<void> {
		void this.getCurrentPosition();
	}

	async getCurrentPosition(): Promise<void> {
		try {
			const position = await Geolocation.getCurrentPosition({
				enableHighAccuracy: true,
			});
			this.coordenadas = `${position.coords.latitude}, ${position.coords.longitude}`;
			this.hasPosition = true;
		} catch {
			// Geolocation is attempted in the background; form submission can continue without blocking the user.
		}
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

	async takePicture(): Promise<void> {
		const image = await Camera.getPhoto({
			quality: 50,
			allowEditing: true,
			direction: CameraDirection.Rear,
			resultType: CameraResultType.Uri,
			correctOrientation: true,
			saveToGallery: true,
			source: CameraSource.Camera,
			width: 500,
			height: 500,
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
		return this.getStorageDataByIndex(1);
	}

	async getTramoId(): Promise<number> {
		return this.getStorageDataByIndex(10);
	}

	private async getStorageDataByIndex(index: number): Promise<number> {
		const info = await this._auth.getStorageData();
		return info[index];
	}

	private generateAlertMessage(fields: string[]): string {
		const listItems = fields
			.map((item) => `<li><b>${item}</b></li>`)
			.join('');
		return `<ul>${listItems}</ul>`;
	}

	private mapFieldName(field: string): string {
		const mapper: Record<string, string> = {
			vehiculoTipoId: 'Vehiculo Tipo',
			vehiculoColorId: 'Color',
			vehiculoMarcaId: 'Marca',
			vehiculoModeloId: 'Modelo',
			provinciaId: 'Provincia',
			municipioId: 'Municipio',
		};

		return mapper[field] ?? field;
	}

	private getInvalidFieldNames(): string[] {
		const invalidFields = new Set<string>();
		const formControls = [
			this.ciudadanoForm.controls,
			this.vehiculoForm.controls,
			this.ubicacionForm.controls,
		];

		// This keeps the confirmation message aligned with both empty required fields and invalid formats.
		formControls.forEach((controls) => {
			Object.keys(controls).forEach((key) => {
				const control = controls[key];
				if (
					control.value === '' ||
					control.value === 0 ||
					control.invalid
				) {
					invalidFields.add(this.mapFieldName(key));
				}
			});
		});

		return Array.from(invalidFields);
	}

	async confirmCreate(): Promise<void> {
		const emptyOrInvalidFields = this.getInvalidFieldNames();

		const formattedMessage: string =
			emptyOrInvalidFields.length > 0
				? `Los siguientes campos estan vacios o no seleccionaste una opcion: ${this.generateAlertMessage(
						emptyOrInvalidFields,
					)}`
				: 'Se revisaron todos los campos, y estan completos !!';

		const alert = await this._alert.create({
			header: 'Confirmar reporte de asistencia',
			subHeader: 'Se enviara la siguiente asistencia.',
			message: formattedMessage,
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

	private getMyCountryDateTime(): string | null {
		const formattedDate = this._datePipe.transform(
			new Date(),
			'yyyy-MM-dd HH:mm:ss',
			'en-US', // This is the LOCALE (data format)
			'es-DO', // This is the TIMEZONE (offset)
		);

		return formattedDate;
	}

	private async ensureCoordinates(): Promise<void> {
		if (!this.coordenadas) {
			await this.getCurrentPosition();
		}
	}

	private normalizeTipoAsistencias(): number[] {
		// The select can return a single value or a list depending on configuration.
		if (typeof this.tipoAsistencias === 'number') {
			return [this.tipoAsistencias];
		}

		return this.tipoAsistencias;
	}

	private buildComentarioBase(identificacion: string): string {
		let comentarioFinal = this.comentario;

		if (identificacion === '') {
			comentarioFinal += '\nNo portaba un documento de identidad.';
		}

		return comentarioFinal;
	}

	private appendMissingInformationNotes(
		currentComment: string,
		marcaTxt: string,
		modeloTxt: string,
	): string {
		let comment = currentComment;

		if (!this.hasPersonalInformation) {
			comment += ' \n-No se tienen los datos personales del ciudadano.\n';
		}

		if (!this.hasVehicleInformation) {
			comment += ` \n-No se tienen los datos del vehículo.\n
				   Marca: ${marcaTxt}\n
				   Modelo: ${modeloTxt}\n
				`;
		}

		return comment;
	}

	private async showRequiredPictureAlert(): Promise<void> {
		const alert = await this._alert.create({
			header: 'Importante',
			subHeader: 'Se requiere tomar la foto',
			message:
				'La imagen es necesaria para la creación de la asistencia, esta es OBLIGATORIA.',
			buttons: ['Aceptar'],
		});

		await alert.present();
	}

	private resetFormState(): void {
		[this.ciudadanoForm, this.vehiculoForm, this.ubicacionForm].forEach(
			(item) => item.reset(),
		);
	}

	private async buildAsistanceRequest(): Promise<IAsistanceCreate> {
		const { identificacion, nombre, apellido, genero, telefono } =
			this.ciudadanoForm.value;

		const {
			vehiculoTipoId,
			vehiculoColorId,
			vehiculoMarcaId,
			vehiculoModeloId,
			placa,
			colorTxt,
			marcaTxt,
			modeloTxt,
		} = this.vehiculoForm.value;

		const { provinciaId, municipioId, direccion } =
			this.ubicacionForm.value;

		const comentarioBase = this.buildComentarioBase(identificacion);
		const comentarioFinal = this.appendMissingInformationNotes(
			comentarioBase,
			marcaTxt,
			modeloTxt,
		);
		const tiempoActual = this.getMyCountryDateTime();

		return {
			// ciudadano
			identificacion,
			nombre,
			apellido,
			genero,
			esExtranjero: this.esExtranjero,
			telefono,
			// vehiculo
			vehiculoColorId,
			vehiculoTipoId,
			vehiculoMarcaId,
			vehiculoModeloId,
			placa,
			// ubicacion
			provinciaId,
			municipioId,
			direccion,
			comentario: comentarioFinal,
			coordenadas: this.coordenadas,
			reportadoPor: this.reportadoPor,
			tipoAsistencias: this.normalizeTipoAsistencias(),
			unidadMiembroId: await this.getUnitMemberId(),
			imagenes: this.imagenes64,
			fueCompletada: this.fueCompletada,
			colorTxt,
			marcaTxt,
			modeloTxt,
			solicitoApoyo: this.solicitoApoyo,
			unidadAlfaId: this.unidadAlfaId ?? 0,
			tiempoLlegada: this.tiempoLlegada,
			tiempoCompletada: this.fueCompletada ? tiempoActual : null,
			tiempoCreacion: tiempoActual,
		};
	}

	async createAsistance(): Promise<void> {
		await this.ensureCoordinates();
		const newAsistencia = await this.buildAsistanceRequest();

		if (newAsistencia.imagenes.length === 0) {
			await this.showRequiredPictureAlert();
			return;
		}

		this._asistencia
			.createAsistance(newAsistencia)
			.subscribe((response) => {
				if (response) {
					this.resetFormState();

					this._asistencia.generateRequestResultAlert(
						'Guardado',
						'',
						'La asistencia fue enviada exitosamente.',
					);

					this.$router.navigate(['dashboard']);
				} else {
					this._asistencia.generateRequestResultAlert(
						'Error',
						'',
						'Ocurrió un error al enviar la asistencia, por favor intenta nuevamente.',
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
					label: 'Completada',
					type: 'radio',
					value: true,
					checked: true,
				},
			],
			animated: true,
			buttons: ['Ok'],
		});

		await estatusAlert.present();
		const { data } = await estatusAlert.onDidDismiss();

		if (typeof data?.values === 'boolean') {
			this.fueCompletada = data.values;
		}

		await this.confirmCreate();
	}

	async showUnidadAlfaAlert(): Promise<void> {
		const alert = await this._alert.create({
			header: 'Recordatorio',
			subHeader: 'Seleccionar unidad alfa',
			message:
				'Si marcas la opcion de Solicito Apoyo de Ambulancia, debes de seleccionar una unidad alfa para validar el apoyo solicitado.',
			buttons: ['Aceptar'],
			animated: true,
			backdropDismiss: false,
		});

		await alert.present();
	}

	async getUnidadesAlfaByTramo(): Promise<void> {
		if (this.solicitoApoyo) {
			const tramoId = await this.getTramoId();
			this._cache.GetUnidadesAlfaByTramo(tramoId);
			await this.showUnidadAlfaAlert();
		}
	}

	private toggleSignatureModalState(type: 'citizen' | 'soldier'): void {
		if (type === 'citizen') {
			this.isCitizenSignatureCapture = !this.isCitizenSignatureCapture;
			return;
		}

		this.isSoldierSignatureCapture = !this.isSoldierSignatureCapture;
	}

	disableCitizenSignModal(): void {
		this.toggleSignatureModalState('citizen');
	}

	disableSoldierSignModal(): void {
		this.toggleSignatureModalState('soldier');
	}

	private captureSignature(data: string, modal: IonModal): void {
		this.imagenes64.push(data);
		modal.dismiss('', 'confirm');
	}

	captureCitizenSignature(data: string): void {
		this.captureSignature(data, this.citizenModal);
	}

	captureSoldierSignature(data: string): void {
		this.captureSignature(data, this.soldierModal);
	}
}
