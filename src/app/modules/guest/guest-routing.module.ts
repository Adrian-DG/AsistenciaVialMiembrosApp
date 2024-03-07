import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { GuestMetricsComponent } from './pages/guest-metrics/guest-metrics.component';

const routes: Routes = [
	{ path: 'metrics', component: GuestMetricsComponent },
	{ path: '', component: IndexComponent, pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class GuestRoutingModule {}
