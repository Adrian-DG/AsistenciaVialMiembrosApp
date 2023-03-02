import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModule } from '../generic/generic.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [],
	imports: [CommonModule, GenericModule, HttpClientModule],
})
export class CacheModule {}
