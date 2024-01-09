import { Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class NewVersionService {
	isNewVersionAvailable: boolean = false;
	newVersionSubscription!: Subscription;
	constructor(private swUpdate: SwUpdate, private location: Location) {
		this.checkForUpdate();
	}

	checkForUpdate(): void {
		this.newVersionSubscription?.unsubscribe();

		if (!this.swUpdate.isEnabled) return;

		this.newVersionSubscription = this.swUpdate.versionUpdates.subscribe(
			(event: VersionEvent) => {
				switch (event.type) {
					case 'VERSION_DETECTED':
						alert(
							'Se ha detectado una nueva version del la App, se iniciara la descarga'
						);
						break;
					case 'VERSION_READY':
						this.swUpdate
							.activateUpdate()
							.then(() => document.location.reload());
						break;
					case 'VERSION_INSTALLATION_FAILED':
						alert('La actualizacion de la app ha fallado');
						break;
					default:
						break;
				}
			}
		);
	}
}
