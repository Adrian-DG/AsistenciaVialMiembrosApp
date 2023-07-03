import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
	declarations: [ToolbarComponent, SpinnerComponent],
	imports: [CommonModule, IonicModule, HttpClientModule],
	exports: [ToolbarComponent, SpinnerComponent],
})
export class GenericModule {}
