import { Component, OnInit, Input } from '@angular/core';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';

@Component({
	selector: 'app-asistencia-card',
	templateUrl: './asistencia-card.component.html',
	styleUrls: ['./asistencia-card.component.scss'],
})
export class AsistenciaCardComponent implements OnInit {
	@Input() item!: IAsistenciaViewModel;
	constructor() {}

	ngOnInit() {}
}
