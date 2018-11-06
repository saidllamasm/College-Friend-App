import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { ImagePlaceholderComponent } from './image-placeholder/image-placeholder';
import { HeaderResizeComponent } from './header-resize/header-resize';
@NgModule({
	declarations: [ProgressBarComponent,
    ImagePlaceholderComponent,
    HeaderResizeComponent],
	imports: [],
	exports: [ProgressBarComponent,
    ImagePlaceholderComponent,
    HeaderResizeComponent]
})
export class ComponentsModule {}
