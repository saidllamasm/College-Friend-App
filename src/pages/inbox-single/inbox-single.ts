import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

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
  msgList : any;
  idToUser : string = "2";
  thisUser : string = "said";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
  ) {

    this.loadFakeMessages();
    
    this.afAuth.authState.subscribe(user => {
      this.thisUser = user.displayName;
      console.log(user.displayName +' detected');
      },(err)=>{
         console.log("problem : ", err)
         alert(err);
      });
  }

  loadFakeMessages(){
    this.msgList = [
      {
        userId:"3",
        userAvatar : "https://www.shareicon.net/download/2015/09/24/106425_man.ico",
        status : "send",
        time :"13:34",
        userName : "Said",
        content: "Hola amigo!"
      },
      {
        userId:"2",
        userAvatar : "https://www.shareicon.net/download/2015/09/24/106425_man.ico",
        status : "send",
        time :"13:43",
        userName : "Juan perez",
        content: "Hola Said!"
      },
      {
        userId:"2",
        userAvatar : "https://www.shareicon.net/download/2015/09/24/106425_man.ico",
        status : "send",
        time :"13:43",
        userName : "Juan perez",
        content: "Como estas??"
      }
    ];
  }

  sendMsg(){
    
  }

  onFocus(){
    
  }
}
