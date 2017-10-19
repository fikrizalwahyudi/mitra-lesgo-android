import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { Zapier } from '../../providers/zapier';
import { UserService } from '../../providers/user-service';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import * as firebase from 'firebase';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/Helper';

/*
  Generated class for the Konsultasi page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any
declare var window;
@Component({
  selector: 'page-konsultasi',
  templateUrl: 'konsultasi.html',
  providers: [UserService, Zapier]
})
export class KonsultasiPage {
  @ViewChild('content') content: Content;
  theChat: any;
  Tutor: any;
  receiver: any;
  uid: any;
  deviceId: any;
  muridUid: any;
  name: any;
  loading: Loading;
  status: any = false;
  chatData: any = [];
  offset: any;
  subscriberTutorList: any;
  muridData: any = [];
  tutorName: string = '';

  constructor(
    public zapier: Zapier,
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public userService: UserService,
    public params: NavParams,
    public helper: Helper,
  ) {
    // this.tutor
    // this.userService.myChatsGuru(this.uid,'cs').once('value').then(function(snapshot){
    //   var data=[];
    //   snapshot.forEach(function(childData){
    //     console.log(childData);
    //     var dats = childData.val();
    //     dats['key']=childData.key;
    //     that.chatData.push(dats);
    //   });
    //   console.log(that.chatData);
    //   return that.chatData.push(data);
    // });
    // console.log(this.chatData);
  }
  ionViewWillEnter() {
    console.log(this.params);
    this.uid = this.params.data.data;
    this.muridUid = this.params.get('muridUid');
    this.muridData = this.params.get('muridData')
    this.name = this.params.get('muridName');
    if (this.muridUid != undefined) {
      this.status = true;
      if (!this.name) {
        this.userService.viewUser(this.muridUid).once('value', (snap) => {
          console.log(snap)
          console.log(snap.val())
          this.name = snap.val().firstName;
          if (!this.muridData) {
            this.tutorName = this.helper.getuser().firstName;
          }
          this.chatHim(this.muridUid, this.name)
        })
      } else {
        if (!this.muridData) {
          if (this.params.get('name')) {
            this.tutorName = this.params.get('name');
          } else {
            this.tutorName = this.helper.getuser().firstName;
          }
        }
        this.chatHim(this.muridUid, this.name)
      }
    } else {
      this.noMurid(this.uid);
    }
  }
  ionViewWillLeave() {
    this.offset.unsubscribe();
    if (this.subscriberTutorList) this.subscriberTutorList.unsubscribe();
  }

  dismiss() {
    this.offset.unsubscribe();
    if (this.subscriberTutorList) this.subscriberTutorList.unsubscribe();
    this.navCtrl.pop();
  }
  noMurid(tutorId) {
    this.subscriberTutorList = this.userService.tutorCariMurid(tutorId).subscribe(snapshot => {
      this.muridData = [];
      console.log(snapshot);
      if (snapshot.length == 0) {
        this.presentAlert('anda belum mempunyai jadwal mengajar');
      }
      var data = snapshot;
      this.muridData = _.remove(data, { status: 'booked' });
      // snapshot.forEach(e=>{
      //   that.tutorData.push(e);
      // })
    })
  }
  chatHim(muridUid, muridName) {
    this.muridUid = muridUid;
    this.name = muridName;
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
    });
    loader.present()
    this.offset = this.userService.newChatTutor(muridUid, this.uid).subscribe(snaps => {
      this.chatData = [];
      var count = 0;
      if (snaps.length == 0) {
        this.userService.firstChatTutor(this.muridUid, this.uid);
      }
      console.log(snaps);
      this.chatData = snaps;
      snaps.forEach(e => {
        if (e.position == 'right' && e.status == false) {
          count = count + 1;
          this.userService.updateChatStatusTutor(this.muridUid, this.uid, e.$key);
        }
      })
      this.status = true;
      setTimeout(() => {
        this.scrollToBottom();
        loader.dismissAll()
      }, 3000);
    })
  }
  openThis(name: string) {
    if (name == 'back') {
      this.navCtrl.pop();
    }
  }
  sendChat() {
    this.userService.sendChatTutorNew(this.theChat, this.muridUid, this.uid, 'text').then(() => {
      this.theChat = null;
    });
  }
  scrollToBottom() {
    console.log('this.content', this.content)
    if (!this.content) return;
    let dimension = this.content.getContentDimensions();
    console.log('dimension.scrollHeight', dimension.scrollHeight)
    this.content.scrollTo(400, dimension.scrollHeight);
  }
  getDates(dates) {
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

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      message: message,
      buttons: [{
        text: 'Dismiss', handler: datas => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public uploadImage(data) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.uid + '/' + this.muridUid);

    const filename = new Date().getTime();
    const imageRef = storageRef.child(`${filename}.png`);

    this.loading = this.loadingCtrl.create({
    });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.sendChatTutorNew(snapshot.downloadURL, this.muridUid, this.uid, 'img');
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
}
