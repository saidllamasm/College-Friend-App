import { Component,ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagePlaceholderComponent } from '../../components/image-placeholder/image-placeholder';

/**
 * Generated class for the WriteReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
})
export class WriteReviewPage {
  
  @ViewChild('menucontainer', {read: ViewContainerRef}) menucontainer: ViewContainerRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  addPicture(){
    const childComponent_var = this.componentFactoryResolver.resolveComponentFactory(ImagePlaceholderComponent);    
    this.menucontainer.createComponent(childComponent_var);
    //alert('c');
  }
}
