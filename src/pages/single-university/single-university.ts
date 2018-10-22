import { University } from './../../model/university/university.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/**
 * Generated class for the SingleUniversityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-university',
  templateUrl: 'single-university.html',
})
export class SingleUniversityPage {
  public name : string;
  public address : string;
  public userCreated : string;


  // for costs progress bar
  porcent : number;
  mount : number;
  min : number;
  max : number;
  color : string;
  //

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afDatabase: AngularFireDatabase,
    public statusBar: StatusBar
    ) {
      statusBar.backgroundColorByHexString('#0055CB');

      let id_university = this.navParams.get('id_university');

      this.afDatabase.list<University>('/Universidades/'+id_university+'/').valueChanges().subscribe((university: University[]) => {
        //alert(JSON.stringify(university));
      });

      this.name = "Instituto tecnologico de ciudad guzman";
      this.address = 'Av afsdf';  
      this.userCreated = "Said Llamas;"

      //progress
      this.mount = 440;
      this.min = 10;
      this.max = 30;
      this.porcent = 90;
      if(this.porcent >= 80 )
        this.color = "danger";
      else if(this.porcent > 50 )
        this.color = "warning";
      else
        this.color = "green"; 

  }

  goBack(){
      this.navCtrl.pop();
  }

}
