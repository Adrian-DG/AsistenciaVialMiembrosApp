import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from './modules/auth/auth.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		HttpClientModule,
		IonicStorageModule.forRoot(),
		AuthModule,
	],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
	bootstrap: [AppComponent],
})
export class AppModule {}
