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

  public url;

  constructor() {
    this.url = 'http://placehold.it/80x80';
  }

}
