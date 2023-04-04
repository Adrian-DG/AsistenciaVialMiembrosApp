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
	constructor(
		public _asistencias: AsistanceService,
		private $activeRoute: ActivatedRoute
	) {}

	ngOnInit() {
		this.ficha = this.$activeRoute.snapshot.params['ficha'];
	}

	ngAfterViewInit(): void {
		this.loadData();
	}

	loadData(): void {
		this._asistencias.getTramosEncargadoSupervisor(this.ficha);
	}
}
