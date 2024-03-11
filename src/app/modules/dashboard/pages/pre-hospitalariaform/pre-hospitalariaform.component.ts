import { Component, OnInit } from '@angular/core';
import { IAsistenciaPreHospitalaria } from '../../interfaces/iasistencia-pre-hospitalaria';
import { CacheService } from 'src/app/modules/cache/services/cache.service';

@Component({
	selector: 'ReportarAsistencia-pre-hospitalariaform',
	templateUrl: './pre-hospitalariaform.component.html',
	styleUrls: ['./pre-hospitalariaform.component.scss'],
})
export class PreHospitalariaformComponent implements OnInit {
	asistencia!: IAsistenciaPreHospitalaria;

	constructor(public _cache: CacheService) {}

	ngOnInit() {
		this._cache.getResource('nacionalidades');
	}
}
