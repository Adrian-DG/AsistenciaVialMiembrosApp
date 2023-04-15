import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LeaveGuard } from './guard/leave.guard';

const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./modules/dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
		canActivate: [AuthenticationGuard],
		canDeactivate: [LeaveGuard],
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./modules/auth/auth.module').then((m) => m.AuthModule),
	},
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
