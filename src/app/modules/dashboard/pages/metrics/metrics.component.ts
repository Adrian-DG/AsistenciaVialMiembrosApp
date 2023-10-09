import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
	selector: 'app-metrics',
	templateUrl: './metrics.component.html',
	styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit, AfterViewInit {
	private ficha!: string;
	private hasSpecialAccess!: boolean;
	public search: string = '';

	tramosDetailsElm!: HTMLDetailsElement;
	unidadDetailElm!: HTMLDetailsElement;
	tipoAsistenciaDetailElm!: HTMLDetailsElement;

	constructor(
		public _asistencias: AsistanceService,
		private $activeRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.ficha = this.$activeRoute.snapshot.params['ficha'];
		this.$activeRoute.queryParamMap.subscribe((param) => {
			this.hasSpecialAccess = (param.get('accesoTotal') ||
				false) as boolean;
		});
	}

	ngAfterViewInit(): void {
		this.loadData();
	}

	displayUnidadesByTramo(tramoId: number): void {
		this.tramosDetailsElm = document.getElementById(
			`tramoDetail#${tramoId}`
		) as HTMLDetailsElement;
		if (!this.tramosDetailsElm.open) {
			this._asistencias.getMetricasAsistenciasUnidadByTramo(tramoId);
		}
	}

	displayAsistenciasByUnidad(unidadId: number): void {
		this.unidadDetailElm = document.getElementById(
			`unidadDetail#${unidadId}`
		) as HTMLDetailsElement;
		if (!this.unidadDetailElm.open) {
			this._asistencias.getMetricasAsistenciasUnidadByTipo(unidadId);
		}
	}

	loadData(): void {
		this._asistencias.getTramosEncargadoSupervisor(
			this.ficha,
			this.hasSpecialAccess
		);
	}
}
