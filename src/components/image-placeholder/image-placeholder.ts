import { Component } from '@angular/core';

/**
 * Generated class for the ImagePlaceholderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'image-placeholder',
  templateUrl: 'image-placeholder.html'
})
export class ImagePlaceholderComponent {

  text: string;

  constructor() {
    console.log('Hello ImagePlaceholderComponent Component');
    this.text = 'Hello World';
  }

}
