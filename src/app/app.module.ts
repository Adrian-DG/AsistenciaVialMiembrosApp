import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './modules/auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { GenericModule } from './modules/generic/generic.module';
import { JwtModule } from '@auth0/angular-jwt';
import { LeaveGuard } from './guard/leave.guard';

import { NgChartsModule } from 'ng2-charts';

export function tokenGetter() {
	return localStorage.getItem('access_token');
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot(),
		AuthModule,
		GenericModule,
		JwtModule.forRoot({
			config: {
				tokenGetter: tokenGetter,
			},
		}),
		NgChartsModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: !isDevMode(),
			// Register the ServiceWorker as soon as the application is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
	],
	providers: [
		LeaveGuard,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LoadingInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
