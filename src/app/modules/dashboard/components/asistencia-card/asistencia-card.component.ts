import { Component, OnInit, Input } from '@angular/core';
import { IAsistenciaViewModel } from '../../interfaces/iasistencia-view-model';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';

@Component({
	selector: 'app-asistencia-card',
	templateUrl: './asistencia-card.component.html',
	styleUrls: ['./asistencia-card.component.scss'],
})
export class AsistenciaCardComponent implements OnInit {
	@Input() ficha!: string | undefined;
	@Input() item!: IAsistenciaViewModel;
	@Input() unidadMiembroId!: number | undefined;
	@Input() departamento!: number | undefined;

	constructor(private _asistencia: AsistanceService) {}

	ngOnInit() {}

	iniciar(id: number): void {
		const ficha = this.ficha ?? null;
		if (ficha != null && this.unidadMiembroId != null) {
			this._asistencia
				.iniciarAsistenciaR5(id, this.unidadMiembroId)
				.subscribe(() =>
					this._asistencia.getAsistenciasUnidad(ficha, 2)
				);
		}
	}
}
