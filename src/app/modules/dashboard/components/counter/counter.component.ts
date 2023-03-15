import { Component, Input, OnInit } from '@angular/core';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';

@Component({
	selector: 'app-counter',
	templateUrl: './counter.component.html',
	styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
	@Input() counter!: IContadorAsistenciaViewModel | null;

	constructor() {}

	ngOnInit() {}
}
