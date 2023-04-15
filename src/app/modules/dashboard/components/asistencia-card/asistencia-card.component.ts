import { Component, OnInit, Input } from '@angular/core';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';
import { AsistanceService } from '../../services/asistance/asistance.service';

@Component({
	selector: 'app-asistencia-card',
	templateUrl: './asistencia-card.component.html',
	styleUrls: ['./asistencia-card.component.scss'],
})
export class AsistenciaCardComponent implements OnInit {
	@Input() ficha!: string | undefined;
	@Input() item!: IAsistenciaViewModel;

	constructor(private _asistencia: AsistanceService) {}

	ngOnInit() {}

	iniciar(id: number): void {
		const ficha = this.ficha ?? null;

		if (ficha != null) {
			this._asistencia
				.iniciarAsistenciaR5(id)
				.subscribe(() => this._asistencia.getAsistenciasUnidad(ficha));
		}
	}
}
