import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { GenericModule } from '../generic/generic.module';
import { CacheModule } from '../cache/cache.module';
import { MemberUnitCardComponent } from './components/member-unit-card/member-unit-card.component';
import { IndexComponent } from './pages/index/index.component';
import { CounterComponent } from './components/counter/counter.component';
import { AsistanceFormComponent } from './pages/asistance-form/asistance-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsistenciaCardComponent } from './components/asistencia-card/asistencia-card.component';

@NgModule({
	declarations: [
		IndexComponent,
		MemberUnitCardComponent,
		CounterComponent,
		AsistanceFormComponent,
		AsistenciaCardComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		IonicModule,
		ReactiveFormsModule,
		FormsModule,
		GenericModule,
		CacheModule,
	],
})
export class DashboardModule {}
