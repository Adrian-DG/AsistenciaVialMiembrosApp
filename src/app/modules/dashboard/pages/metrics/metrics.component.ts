import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { ActivatedRoute } from '@angular/router';

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
		this._asistencias.getMetricasAsistenciasUnidadByTramo(
			tramoId,
			this.ficha
		);
	}

	displayAsistenciasByUnidad(unidadId: number): void {
		this._asistencias.getMetricasAsistenciasUnidadByTipo(unidadId);
	}

	loadData(): void {
		this._asistencias.getTramosEncargadoSupervisor(
			this.ficha,
			this.hasSpecialAccess
		);
	}

	handleRefresh(event: any) {
		setTimeout(() => {
			this.loadData();
			event.target.complete();
		});
	}
}
