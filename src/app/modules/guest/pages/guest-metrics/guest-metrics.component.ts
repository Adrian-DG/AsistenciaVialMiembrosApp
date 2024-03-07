import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { IDataModel } from '../../models/idata-model';
import { IStatsFilter } from '../../dto/istats-filter';
import { GuestService } from '../../services/guest.service';
import { AsistanceService } from 'src/app/modules/dashboard/services/asistance/asistance.service';
import { Router } from '@angular/router';

@Component({
	selector: 'ReportarAsistencia-guest-metrics',
	templateUrl: './guest-metrics.component.html',
	styleUrls: ['./guest-metrics.component.scss'],
})
export class GuestMetricsComponent implements OnInit, AfterViewInit {
	filter!: IStatsFilter;

	chartOptions: ChartOptions = {
		responsive: true,
		animations: {
			tension: {
				duration: 1000,
				easing: 'linear',
				from: 1,
				to: 0,
				loop: true,
			},
		},
		// indexAxis: 'x',
		// scales: {
		// 	y: { beginAtZero: true },
		// 	x: { beginAtZero: true },
		// },
		borderColor: '#838584',
		plugins: {
			title: {
				display: true,
				align: 'start',
				color: '#838584',
				fullSize: true,
				position: 'top',
			},
			legend: {
				display: true,
				align: 'center',
				position: 'bottom',
				fullSize: true,
			},
			tooltip: {
				enabled: true,
			},
		},
	};

	chartData!: ChartData;

	constructor(
		public _guest: GuestService,
		public _asistencias: AsistanceService,
		private $router: Router
	) {}

	ngOnInit() {
		this.initChart();
	}

	ngAfterViewInit(): void {
		this.getStatsTramos();
	}

	initChart(): void {
		this._guest
			.getQuienReportaStats({
				estatus: 3,
				initial: new Date(),
				final: new Date(),
			})
			.subscribe((data: IDataModel[]) => {
				this.chartData = {
					labels: data.map((x) => x.nombre),
					datasets: [
						{
							label: 'Estatus',
							data: data.map((x) => x.value),
						},
					],
				};
			});
	}

	getStatsTramos(): void {
		this._asistencias.getTramosEncargadoSupervisor('Prueba1', true);
	}

	getStatsUnidadByTramo(tramoId: number): void {
		this._asistencias.getMetricasAsistenciasUnidadByTramo(
			tramoId,
			'Prueba1'
		);
	}

	displayAsistenciasByUnidad(unidadId: number): void {
		this._asistencias.getMetricasAsistenciasUnidadByTipo(unidadId);
	}

	goToCreatePage(): void {
		this.$router.navigate(['guest/create']);
	}
}
