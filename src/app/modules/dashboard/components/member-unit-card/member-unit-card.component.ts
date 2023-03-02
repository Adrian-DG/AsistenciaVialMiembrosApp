import { Component, OnInit, Input } from '@angular/core';
import { IMemberUnitInfo } from '../../interfaces/imember-unit-info';

@Component({
	selector: 'app-member-unit-card',
	templateUrl: './member-unit-card.component.html',
	styleUrls: ['./member-unit-card.component.scss'],
})
export class MemberUnitCardComponent implements OnInit {
	@Input() memberInfo!: IMemberUnitInfo | null;
	constructor() {}

	ngOnInit() {}
}
