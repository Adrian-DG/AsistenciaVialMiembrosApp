import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistanceService } from '../../services/asistance/asistance.service';
import { IAsistenciaEditViewModel } from '../../interfaces/iasistencia-edit-view-model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'AsistenciaVial-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, AfterViewInit {
	id!: number;
	asistenciaObject: IAsistenciaEditViewModel | undefined;

	constructor(
		private $activeRoute: ActivatedRoute,
		private _asistencias: AsistanceService
	) {}

	ngOnInit() {
		this.$activeRoute.params.subscribe((params) => {
			this.id = parseInt(params['id']);
		});
	}

	ngAfterViewInit(): void {
		if (this.id) {
			this._asistencias
				.getEditAsistenciaViewModel(this.id)
				.subscribe((data: IAsistenciaEditViewModel) => {
					this.asistenciaObject = data;
				});
		}
	}

	saveChanges(): void {
		if (this.asistenciaObject) {
			this._asistencias.guardarCambios(this.asistenciaObject);
		}
	}
}
