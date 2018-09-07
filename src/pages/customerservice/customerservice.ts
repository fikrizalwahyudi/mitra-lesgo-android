import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ModalController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IonicImageViewerModule } from 'ionic-img-viewer';

/*
  Generated class for the Customeservice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/declare var cordova: any
declare var window;
@Component({
  selector: 'page-customerservice',
  templateUrl: 'customerservice.html',
  providers: [UserService]
})
export class CustomerservicePage {
  @ViewChild('content') content: Content;
  theChat: any;
  receiver: any;
  name: any;
  lastImage: string = null;
  loading: Loading;
  captureDataUrl: any;
  chatData: any = [];
  uid: any;
  offset: any;
  subcribers: any[];

  constructor(
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) {
    console.log(this.params);
    // let loader = this.loadingCtrl.create({
    //   content: '<img src="./assets/loading.gif"/>',
    //   spinner: 'hide',
    //   duration: 500
    // });
    // loader.present()
    // this.userService.myChatsGuru(this.uid,'cs').once('value').then((snapshot)=>{
    //   var data=[];
    //   snapshot.forEach((childData)=>{
    //     console.log(childData);
    //     var dats = childData.val();
    //     dats['key']=childData.key;
    //     that.ChatData.push(dats);
    //   });
    //   console.log(that.ChatData);
    //   return that.ChatData.push(data);
    // });

    // this.updateChat();
    // loader.dismiss();
  }
  ionViewWillEnter() {
    this.uid = this.params.get('data');
    this.name = this.params.get('name');
    this.updateChat();
  }
  ionViewWillLeave() {
    this.offset.unsubscribe();
  }
  dismiss() {
    this.offset.unsubscribe();
    this.navCtrl.pop();
  }
  updateChat() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
      duration: 1000
    });
    loader.present()
    this.offset = this.userService.newChatCs(this.uid).subscribe(snapshot => {
      this.chatData = snapshot;
      var count = 0;
      if (snapshot.length == 0) {
        this.userService.sendFirstChat(this.uid, this.name)
      } else {
        snapshot.forEach(e => {
          if (e.position == 'left' && e.status == false) {
            count = count + 1;
            this.userService.updateChatStatus(e.$key, this.uid);
          }
        })
      }
      setTimeout(() => {
        // this.content.scrollToBottom(300);
        // this.scrollToBottom();
        // console.log("chat.length", this.myChat.length);
        var i = "chat" + this.chatData.length;
        // console.log("iiii", i);
        var element = document.getElementById(i);
        // console.log(element);
        element.scrollIntoView();
        // console.log("kepanggil 2 ");

        loader.dismissAll();
        // this.myChat = this.myChat.reverse();
      }, 2000);
      console.log(this.chatData);
      console.log(snapshot);
    })
  }

  scrollToBottom(elem: ElementRef) {
    // this.messages.push('message_added');
    elem.nativeElement.scrollIntoView();
    // this.content.scrollToBottom(300);
  }

  openThis(name: string) {
    if (name == 'back') {
      this.navCtrl.pop();
    }
  }
  sendChat() {
    this.userService.sendChatCsNew(this.theChat, this.uid, this.name, 'text');
    console.log(this.theChat);
    this.theChat = null;
  }
  getDates(dates) {
    //  var date = new Date(0);
    //  date.setUTCMilliseconds(dates);
    //  date.toLocaleString();
    //  var day = date.getDate();
    //   var monthIndex = date.getMonth();
    //   var year = date.getFullYear();
    //   var minutes = date.getMinutes();
    //   var hours = date.getHours();
    //   var format = day+"/"+monthIndex+"/"+year+" "+hours+":"+minutes;
    return moment(dates).format('DD/MM/YYYY');
  }
  getHour(hour) {
    var a = new Date(hour).getHours();
    var b = new Date(hour).getMinutes();
    if (b > 9) {
      return a + ':' + b;
    } else {
      return a + ':0' + b;
    }
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public uploadImage(data) {
    let storageRef = firebase.storage().ref(this.uid + '/cs/');
    const filename = new Date().getTime();
    const imageRef = storageRef.child(`${filename}.png`);

    this.loading = this.loadingCtrl.create({});
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.sendChatCsNew(snapshot.downloadURL, this.uid, this.name, 'img');
      this.loading.dismissAll()
    }, err => {
      this.loading.dismissAll()
    });

  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      allowEdit: true,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: 0,
      encodingType: this.Camera.EncodingType.JPEG,
      mediaType: 0,
      correctOrientation: true
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.uploadImage(imagePath);
    }, (err) => {
    });
  }

  // scrollToBottom() {
  //   console.log('this.content', this.content)
  //   if (!this.content) return;
  //   let dimension = this.content.getContentDimensions();
  //   console.log('dimension', dimension)
  //   this.content.scrollTo(300, dimension.scrollHeight);
  // }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  update() {
    this.content.resize();
  }
}
