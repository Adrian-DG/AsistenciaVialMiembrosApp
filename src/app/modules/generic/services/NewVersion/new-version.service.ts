import { Injectable, NgZone } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root',
})
export class NewVersionService {
	isNewVersionAvailable: boolean = false;
	private readonly FAILED_UPDATE: string =
		'La actualizacion de la app ha fallado';
	private readonly FOUND_AVAILABLE_UPDATE: string =
		'Se ha detectado una nueva versión del la App, se iniciara la descarga';
	private readonly UPDATE_INSTALLED_SUCCESS: string =
		'La app se ha actualizado de manera exitosa!!';
	private readonly DOWNLOADING_UPDATE: string =
		'Se esta descargando la actualización.';
	private readonly NO_NEW_VERSIONS_FOUND: string =
		'No se han encontrado nuevas versiones disponibles';
	private readonly DEFAULT_DURATION: number = 3000;

	constructor(
		private swUpdate: SwUpdate,
		private zone: NgZone,
		private _toast: ToastController,
		private _loading: LoadingController
	) {
		// this.checkForUpdate();
	}

	checkForUpdateAutomatically(): void {
		console.log('check for updates automatically!');
		if (!this.swUpdate.isEnabled) {
			console.log('swupdate is disable!!');
			return;
		}

		this.swUpdate.versionUpdates.subscribe(async (event: VersionEvent) => {
			const toast = await this._toast.create({
				duration: this.DEFAULT_DURATION,
				position: 'top',
				color: 'secondary',
			});

			switch (event.type) {
				case 'VERSION_DETECTED':
					toast.message = this.FOUND_AVAILABLE_UPDATE;
					await toast.present();
					await toast.onDidDismiss();
					break;
				case 'VERSION_READY':
					const loading = await this._loading.create({
						message: this.DOWNLOADING_UPDATE,
						duration: this.DEFAULT_DURATION,
					});
					await loading.present();
					await loading.onDidDismiss();
					if (await this.swUpdate.activateUpdate()) {
						toast.message = this.UPDATE_INSTALLED_SUCCESS;
						toast.color = 'success';
						await toast.present();
					} else {
						toast.message = this.FAILED_UPDATE;
						toast.color = 'danger';
						await toast.present();
					}
					await toast.onDidDismiss();
					break;
				case 'NO_NEW_VERSION_DETECTED':
					console.log(this.NO_NEW_VERSIONS_FOUND);
					break;
				default:
					console.log(this.FAILED_UPDATE);
			}
		});
	}

	checkForUpdateManually(): void {
		console.log('check updtade on click');
		if (!this.swUpdate.isEnabled) {
			console.log('swupdate is disable!!');
			return;
		}

		this.zone.runOutsideAngular(async () => {
			const toast = await this._toast.create({
				duration: this.DEFAULT_DURATION,
				position: 'top',
				color: 'secondary',
			});

			try {
				if (await this.swUpdate.checkForUpdate()) {
					toast.message = this.FOUND_AVAILABLE_UPDATE;
					await toast.present();
					await toast.onDidDismiss();

					const loading = await this._loading.create({
						message: this.DOWNLOADING_UPDATE,
						duration: this.DEFAULT_DURATION,
						animated: true,
					});
					await loading.present();
					await loading.onDidDismiss();

					if (await this.swUpdate.activateUpdate()) {
						document.location.reload();
						toast.message = this.UPDATE_INSTALLED_SUCCESS;
						toast.color = 'success';
						await toast.present();
						await toast.onDidDismiss();
					} else {
						toast.message = this.FAILED_UPDATE;
						toast.color = 'danger';
						await toast.present();
						await toast.onDidDismiss();
					}
				} else {
					toast.message = this.NO_NEW_VERSIONS_FOUND;
					toast.color = 'warning';
					await toast.present();
					await toast.onDidDismiss();
				}
			} catch (error) {
				console.error('Error: ', error);
			}
		});
	}
}
