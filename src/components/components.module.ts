import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { ImagePlaceholderComponent } from './image-placeholder/image-placeholder';
@NgModule({
	declarations: [ProgressBarComponent,
    ImagePlaceholderComponent],
	imports: [],
	exports: [ProgressBarComponent,
    ImagePlaceholderComponent]
})
export class ComponentsModule {}
