import { Component, Input, OnInit } from '@angular/core';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';
import { AsistanceService } from '../../services/asistance/asistance.service';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
	constructor(public _asistencia: AsistanceService) {}

	ngOnInit() {}
}
