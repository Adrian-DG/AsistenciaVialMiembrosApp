import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { GenericModule } from '../generic/generic.module';
import { CacheModule } from '../cache/cache.module';
import { MemberUnitCardComponent } from './components/member-unit-card/member-unit-card.component';
import { IndexComponent } from './pages/index/index.component';
import { CounterComponent } from './components/counter/counter.component';

@NgModule({
	declarations: [IndexComponent, MemberUnitCardComponent, CounterComponent],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		IonicModule,
		GenericModule,
		CacheModule,
	],
})
export class DashboardModule {}
