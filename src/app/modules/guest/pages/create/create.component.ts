import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AsistanceService } from 'src/app/modules/dashboard/services/asistance/asistance.service';

@Component({
	selector: 'ReportarAsistencia-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
	constructor(private _asistencia: AsistanceService) {}

	ngOnInit() {}
}
