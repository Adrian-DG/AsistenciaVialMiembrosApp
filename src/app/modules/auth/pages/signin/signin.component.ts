import { Component, OnDestroy, OnInit } from '@angular/core';
import { ILoginUnitMember } from '../../interfaces/ilogin-unit-member';
import { AuthService } from '../../services/auth.service';
import { NewVersionService } from 'src/app/modules/generic/services/NewVersion/new-version.service';
import { Router } from '@angular/router';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
}

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
	cedulaInput: string = '';
	fichaInput: string = '';
	isWriting: boolean = false;
	isInstallAvailable: boolean = false;

	private deferredPrompt: BeforeInstallPromptEvent | null = null;
	private readonly onBeforeInstallPrompt = (event: Event): void => {
		event.preventDefault();
		this.deferredPrompt = event as BeforeInstallPromptEvent;
		this.isInstallAvailable = true;
	};

	constructor(
		public _auth: AuthService,
		private _newVersionService: NewVersionService,
		private _router: Router,
	) {}

	ngOnInit() {
		window.addEventListener(
			'beforeinstallprompt',
			this.onBeforeInstallPrompt,
		);
	}

	ngOnDestroy(): void {
		window.removeEventListener(
			'beforeinstallprompt',
			this.onBeforeInstallPrompt,
		);
	}

	hideImage = () => (this.isWriting = true);

	validateMember(): void {
		const cedula = this.cedulaInput.trim();
		if (!cedula) {
			return;
		}

		this._auth.validateMember(cedula);
	}

	validateUnit(): void {
		const ficha = this.fichaInput.trim();
		if (!ficha) {
			return;
		}

		this._auth.validateUnit(ficha);
	}

	loginUnitMember(): void {
		this.isWriting = false;

		const cedula = this.cedulaInput.trim();
		const ficha = this.fichaInput.trim();
		if (!cedula || !ficha) {
			return;
		}

		const model: ILoginUnitMember = {
			cedula,
			ficha,
		};
		this._auth.loginUnitMember(model);
	}

	async installApp(): Promise<void> {
		if (!this.deferredPrompt) {
			return;
		}

		await this.deferredPrompt.prompt();
		await this.deferredPrompt.userChoice;

		this.deferredPrompt = null;
		this.isInstallAvailable = false;
	}

	checkUpdate(): void {
		this._newVersionService.checkForUpdateManually();
	}

	loginAsGuest(): void {
		this._router.navigate(['guest']);
	}
}
