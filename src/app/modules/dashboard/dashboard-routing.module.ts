import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistanceFormComponent } from './pages/asistance-form/asistance-form.component';
import { IndexComponent } from './pages/index/index.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { EditComponent } from './pages/edit/edit.component';
import { LeaveGuard } from 'src/app/guard/leave.guard';
import { PreHospitalariaformComponent } from './pages/pre-hospitalariaform/pre-hospitalariaform.component';

const routes: Routes = [
	{
		path: 'pre-hospitalaria-form',
		component: PreHospitalariaformComponent,
	},
	{ path: 'edit/:id', component: EditComponent, canDeactivate: [LeaveGuard] },
	{
		path: 'metrics/:ficha',
		component: MetricsComponent,
	},
	{
		path: 'create',
		component: AsistanceFormComponent,
		canDeactivate: [LeaveGuard],
	},
	{ path: '', component: IndexComponent, pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
