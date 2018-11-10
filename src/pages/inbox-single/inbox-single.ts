import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, } from 'angularfire2/database';

import { AngularFireList } from 'angularfire2/database';
import { database} from 'firebase';
import md5 from 'crypto-md5';

/**
 * Generated class for the InboxSinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inbox-single',
  templateUrl: 'inbox-single.html',
})
export class InboxSinglePage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  editorMsg = '';
  showEmojiPicker = false;
  msgList = [];
  idFromUser : string = '';
  thisUser : string = '';
  searchByChatToken = 'null';
  searchByUserUID = 'null';
  userPicture = ''; // this profile


  // for cache users

  emailFrom = '';
  emailTo = '';
  nameFrom = '';
  nameTo = '';
  idFrom = '';
  idTo = '';

  personName = ''; //for header

  loadFirstTime = true;

  msjDB: AngularFireList<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public afDatabase: AngularFireDatabase,
  ) {
    this.afAuth.authState.subscribe(user => {
      this.idFromUser = user.uid;
      this.searchByUserUID = this.navParams.get('id_user');
      this.searchByChatToken = this.navParams.get('id_chat');
      if(this.searchByUserUID !== undefined){
        alert('search user');
      }else if(this.searchByChatToken !== undefined){
        this.afDatabase.database.ref('/Chats/'+this.searchByChatToken).once('value').then( (snpUsers) => {
          this.afDatabase.database.ref('/Usuarios/'+snpUsers.val().uidcreador).once('value').then( (snpFrm) => {
            this.emailFrom = snpFrm.val().email;
            this.nameFrom = snpFrm.val().nombre;
            this.idFrom = snpFrm.val().key;
            this.afDatabase.database.ref('/Usuarios/'+snpUsers.val().uiddestino).once('value').then( (snpTo) => {
              this.emailTo = snpTo.val().email;
              this.nameTo = snpTo.val().nombre;
              this.idTo = snpFrm.val().key;
              this.loadMessagesWithChat();
            });
          });
        });
      }else{
        alert('error');
      }
      },(err)=>{
         console.log("problem : ", err)
         alert(err);
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
      return { hora : 24-hora,  letra : 'PM'};
    else
      return { hora : hora,  letra : 'AM'};

  }

  loadMessagesWithChat(){
    this.afDatabase.database.ref('/Chats/'+this.searchByChatToken).once('value').then( (snapshot) => {
      //"use strict";
      for(var ip in snapshot.val().mensajes){
        if(snapshot.val().mensajes[ip].uiduser != this.idTo){
          this.msgList.push({
            userId: snapshot.val().mensajes[ip].uiduser,
            userAvatar : "https://www.gravatar.com/avatar/" + md5(this.emailTo, 'hex')+"?s=400",
            status : "send",
            time : this.convertToMeridiano(this.timeConverter(snapshot.val().mensajes[ip].timestamp).hora).hora  + ':'+this.timeConverter(snapshot.val().mensajes[ip].timestamp).minuto + ' ' + this.convertToMeridiano(this.timeConverter(snapshot.val().mensajes[ip].timestamp).hora).letra,//,
            userName : this.nameTo.split(' ')[0],
            content: snapshot.val().mensajes[ip].contenido
          });
        }else{
          this.msgList.push({
            userId: snapshot.val().mensajes[ip].uiduser,
            userAvatar : "https://www.gravatar.com/avatar/" + md5(this.emailFrom, 'hex')+"?s=400",
            status : "send",
            time : this.convertToMeridiano(this.timeConverter(snapshot.val().mensajes[ip].timestamp).hora).hora  + ':'+this.timeConverter(snapshot.val().mensajes[ip].timestamp).minuto + ' ' + this.convertToMeridiano(this.timeConverter(snapshot.val().mensajes[ip].timestamp).hora).letra,
            userName : this.nameFrom.split(' ')[0],
            content: snapshot.val().mensajes[ip].contenido
          });
        }
      }
      this.scrollToBottom();
      //this.scrollToBottom();
      if(this.loadFirstTime)
        this.listenerMessages();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 300);
  }

  listenerMessages(){
    console.log('listener messages running');
    this.loadFirstTime = false;
    this.afDatabase.database.ref('/Chats/'+this.searchByChatToken).on('value', (snap) => { 
      this.loadMessagesWithChat();
      //play sound
    });
  }

  sendMsg(){
    this.afAuth.authState.subscribe(user => {
      if(this.searchByUserUID !== undefined){
        alert('search user');
      }else if(this.searchByChatToken !== undefined){
        let msj = {
          uiduser: user.uid,
          contenido:  this.editorMsg,
          timestamp: database.ServerValue.TIMESTAMP,
        };
        this.msjDB = this.afDatabase.list('/Chats/' + this.searchByChatToken+'/mensajes/');
        this.msjDB.push( msj ).key;
        this.msjDB = this.afDatabase.list('/Chats');
        this.msjDB.update(this.searchByChatToken, {lastmsj:this.editorMsg});
        this.msjDB.update(this.searchByChatToken, {timestamp: database.ServerValue.TIMESTAMP});
        //this.msjDB.update('timestamp', database.ServerValue.TIMESTAMP);
        this.editorMsg = '';
      }
    });
    
  }

  onFocus(){
    
  }
}
