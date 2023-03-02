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
				ficha: response[1],
				miembro: response[2],
				placa: response[3],
				tramo: response[4],
			};
		});
	}
}
