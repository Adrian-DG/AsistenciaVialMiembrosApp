import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoutingModule } from './guest-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './pages/index/index.component';
import { IonicModule } from '@ionic/angular';
import { GuestMetricsComponent } from './pages/guest-metrics/guest-metrics.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
	declarations: [IndexComponent, GuestMetricsComponent],
	imports: [
		CommonModule,
		GuestRoutingModule,
		IonicModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgChartsModule,
		DashboardModule,
	],
})
export class GuestModule {}
