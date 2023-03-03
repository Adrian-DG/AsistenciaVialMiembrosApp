import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
	infoUser: IMemberUnitInfo | null = null;
	constructor(private _auth: AuthService) {}

	ngOnInit() {
		this._auth.getStorageData().then((response) => {
			console.log(response);
			this.infoUser = {
				denominacion: response[0],
				unidadMiembroId: response[1],
				ficha: response[2],
				miembro: response[3],
				placa: response[4],
				tramo: response[5],
			};
		});
	}
}
