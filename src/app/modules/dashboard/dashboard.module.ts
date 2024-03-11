import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GenericModule } from '../generic/generic.module';
import { CacheModule } from '../cache/cache.module';
import { MemberUnitCardComponent } from './components/member-unit-card/member-unit-card.component';
import { IndexComponent } from './pages/index/index.component';
import { CounterComponent } from './components/counter/counter.component';
import { AsistanceFormComponent } from './pages/asistance-form/asistance-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsistenciaCardComponent } from './components/asistencia-card/asistencia-card.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { EditComponent } from './pages/edit/edit.component';
import { FilterPipe } from './pipes/filter.pipe';
import { PreHospitalariaformComponent } from './pages/pre-hospitalariaform/pre-hospitalariaform.component';

@NgModule({
	declarations: [
		IndexComponent,
		MemberUnitCardComponent,
		CounterComponent,
		AsistanceFormComponent,
		AsistenciaCardComponent,
		MetricsComponent,
		EditComponent,
		PreHospitalariaformComponent,
		FilterPipe,
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
