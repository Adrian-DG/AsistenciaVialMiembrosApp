import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistanceFormComponent } from './pages/asistance-form/asistance-form.component';
import { IndexComponent } from './pages/index/index.component';
import { MetricsComponent } from './pages/metrics/metrics.component';

const routes: Routes = [
	{ path: 'metrics/:ficha', component: MetricsComponent },
	{ path: 'create', component: AsistanceFormComponent },
	{ path: '', component: IndexComponent, pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
