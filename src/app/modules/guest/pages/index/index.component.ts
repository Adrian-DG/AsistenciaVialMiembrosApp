import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../services/guest.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'ReportarAsistencia-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
	cedula: FormControl<string> = new FormControl<string>('', {
		nonNullable: true,
		validators: [
			Validators.required,
			Validators.minLength(11),
			Validators.maxLength(11),
			Validators.pattern('^[0-9]+$'),
		],
	});

	constructor(private _guest: GuestService) {}

	ngOnInit() {
		this._guest.checkIfGuestAuthenticated();
	}

	validate(): void {
		const normalizedCedula = this.cedula.value.trim();
		if (this.cedula.invalid || !normalizedCedula) {
			this.cedula.markAsTouched();
			return;
		}

		this._guest.confirmGuestAccess(normalizedCedula);
	}
}
