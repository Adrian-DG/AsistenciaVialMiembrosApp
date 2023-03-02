import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
	declarations: [ToolbarComponent],
	imports: [CommonModule, IonicModule, HttpClientModule],
	exports: [ToolbarComponent],
})
export class GenericModule {}
