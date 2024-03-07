import { Component, OnInit } from '@angular/core';
import { GuestService } from '../../services/guest.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'ReportarAsistencia-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
	cedula: FormControl = new FormControl('', [Validators.required]);
	constructor(private _guest: GuestService) {}

	ngOnInit() {
		this._guest.checkIfGuestAuthenticated();
	}

	validate(): void {
		this._guest.confirmGuestAccess(this.cedula.value);
	}
}
