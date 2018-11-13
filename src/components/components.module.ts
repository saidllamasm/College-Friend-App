import { NgModule } from '@angular/core';
import { HeaderResizeComponent } from './header-resize/header-resize';
import { IonicModule } from 'ionic-angular'
import { CommonModule } from '@angular/common';
@NgModule({
	declarations: [
        HeaderResizeComponent
    ],
	imports: [
        CommonModule ,
        IonicModule
    ],
	exports: [
        HeaderResizeComponent
    ]
})
export class ComponentsModule {}
