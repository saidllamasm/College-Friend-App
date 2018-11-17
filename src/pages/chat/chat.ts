import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InboxSinglePage } from '../inbox-single/inbox-single';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  uuid : string ;
  public userPicture = '';
  public MessageList = [];
  public MessageListRequests = [];

  public username = '';
  public numberChats = 0;

  messages : boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase
  ) {
    
  }

  ionViewWillEnter(){
    this.MessageList = [];
    this.numberChats = 0;
    this.afAuth.authState.subscribe(user => {
      this.uuid = user.uid;
      this.username = user.displayName ;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      this.afDatabase.database.ref('/Chats/').once('value').then( (snapshot) => {
        for(var ip in snapshot.val()){
          this.numberChats++;
          if(snapshot.val()[ip].uidcreador == user.uid || snapshot.val()[ip].uiddestino == user.uid ){
            if(snapshot.val()[ip].uidcreador == user.uid){
              this.createMsj(ip, snapshot.val()[ip].uiddestino,  snapshot.val()[ip].timestamp,snapshot.val()[ip].lastmsj);
            }else{
              this.createMsj(ip, snapshot.val()[ip].uidcreador,  snapshot.val()[ip].timestamp,snapshot.val()[ip].lastmsj);
            }
          }
        }
      });
    });
  }

  timeConverter(time){
    var timestamp   = time.toString().substring(0,10),
    date        = new Date(timestamp * 1000),
    datevalues  = [
                   date.getFullYear(), //0
                   date.getMonth(), //1
                   date.getDate(), //2
                   date.getHours(), //3
                   date.getMinutes(), //4
                   date.getSeconds(), //5
                ]; 
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var timeTraslate = {
      segundo : datevalues[5],
      minuto : datevalues[4],
      hora  : datevalues[3],
      dia : datevalues[2],
      mes : months[datevalues[1]],
      año : datevalues[0]
    };
    
    return timeTraslate;
  }

  convertToMeridiano(hora){
    if(hora > 12 )
      return { hora : hora,  letra : 'PM'};
    else
      return { hora : hora,  letra : 'AM'};

  }

  createMsj(id, uid, timestamp, abs){
    this.afDatabase.database.ref('/Usuarios/'+uid).once('value').then( (snapshot) => {
      this.MessageList.push({
        profileTo : "https://www.gravatar.com/avatar/" + md5(snapshot.val().email, 'hex')+"?s=400",
        nameTo : snapshot.val().nombre,
        date: this.convertToMeridiano(this.timeConverter(timestamp).hora).hora  + ':'+this.timeConverter(timestamp).minuto + ' ' + this.convertToMeridiano(this.timeConverter(timestamp).hora).letra,
        abstract : abs,
        idchat: id
      });
    });
  }

  openConversation(id){
    //this.navCtrl.setRoot(InboxSinglePage); //change to push 
    this.navCtrl.push(InboxSinglePage,{id_chat : id });
  }

  changeViewMessages(){
    this.messages = true;
  }
  changeViewRequests(){
    this.messages = false;
  }
}
