import { Component, OnInit, Input } from '@angular/core';
import { IContadorAsistenciaViewModel } from '../../interfaces/icontador-asistencia-view-model';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';

@Component({
	selector: 'app-member-unit-card',
	templateUrl: './member-unit-card.component.html',
	styleUrls: ['./member-unit-card.component.scss'],
})
export class MemberUnitCardComponent implements OnInit {
	@Input() memberInfo!: IMemberUnitInfo | null;
	@Input() counter!: IContadorAsistenciaViewModel | null;
	constructor() {}

	ngOnInit() {}
}
