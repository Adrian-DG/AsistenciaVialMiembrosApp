import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestRoutingModule } from './guest-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './pages/index/index.component';
import { IonicModule } from '@ionic/angular';
import { GuestMetricsComponent } from './pages/guest-metrics/guest-metrics.component';

@NgModule({
	declarations: [IndexComponent, GuestMetricsComponent],
	imports: [
		CommonModule,
		GuestRoutingModule,
		IonicModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class GuestModule {}
