import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { GenericModule } from '../generic/generic.module';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CacheModule } from '../cache/cache.module';

@NgModule({
	declarations: [SigninComponent, SignupComponent],
	imports: [
		CommonModule,
		AuthRoutingModule,
		HttpClientModule,
		GenericModule,
		CacheModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class AuthModule {}
