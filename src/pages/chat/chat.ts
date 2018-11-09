import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InboxSinglePage } from '../inbox-single/inbox-single';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import md5 from 'crypto-md5';

import { UserCustom } from '../../model/user/user.model';
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
    this.afAuth.authState.subscribe(user => {
      this.uuid = user.uid;
      this.username = user.displayName ;
      this.userPicture = "https://www.gravatar.com/avatar/" + md5(user.email, 'hex')+"?s=400";
      this.afDatabase.database.ref('/Chats/').once('value').then( (snapshot) => {
        for(var ip in snapshot.val()){
          if(snapshot.val()[ip].uidcreador == user.uid || snapshot.val()[ip].uiddestino == user.uid ){
            if(snapshot.val()[ip].uidcreador == user.uid){
              this.createMsj(ip, snapshot.val()[ip].uiddestino,  snapshot.val()[ip].timestamp,snapshot.val()[ip].lastmsj);
            }else{
              this.createMsj(ip, snapshot.val()[ip].uidcreador,  snapshot.val()[ip].timestamp,snapshot.val()[ip].lastmsj);
                /*this.MessageList.push({
                  profileTo : snapshot.val()[ip].uidcreador,
                  nameTo : snapshot.val()[ip].uidcreador,
                  date: snapshot.val()[ip].timestamp,
                  abstract : snapshot.val()[ip].lastmsj,
                  idchat: ip
                });*/
            }
            
            /*
            load all messages
            for (var ip2 in snapshot.val()[ip].mensajes) {
              alert(snapshot.val()[ip].mensajes[ip2].contenido);
            }*/
          }
        }
      });
    });
    //this.loadFakeDate();
  }

  createMsj(id, uid, timestamp, abs){
    this.afDatabase.database.ref('/Usuarios/'+uid).once('value').then( (snapshot) => {
      this.MessageList.push({
        profileTo : "https://www.gravatar.com/avatar/" + md5(snapshot.val().email, 'hex')+"?s=400",
        nameTo : snapshot.val().nombre,
        date: timestamp,
        abstract : abs,
        idchat: id
      });
    });
  }

  loadFakeDate(){
    this.MessageList = [
      {
        profileTo : 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        nameTo : 'Juanito',
        date: '3:00pm',
        abstract : 'Hola said!',
        idchat: 1
      }
    ];
    this.MessageListRequests = [
      {
        profileTo : 'https://griffonagedotcom.files.wordpress.com/2016/07/profile-modern-2e.jpg',
        nameTo : 'María',
        date: '10:00pm',
        abstract : 'Saludos!',
        idchat: 1
      }
    ];
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
