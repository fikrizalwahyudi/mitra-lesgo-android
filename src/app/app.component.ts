import { Component } from '@angular/core';
import { Platform, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { OrderGuruPage } from '../pages/order-guru/order-guru';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Calendar } from '@ionic-native/calendar';
import { Helper } from '../providers/Helper';




@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;
  pushObject: PushObject;

  constructor(
    public calendar: Calendar,
    public platform: Platform,
    public LoadingController: LoadingController,
    public push: Push,
    public helper: Helper,
  ) {
    Splashscreen.show();
    var config = {
      apiKey: "AIzaSyBFKhA17tr8f2ki0agybmDZ2Pk_iYu2YLg",
      authDomain: "web-uat-1a4d8.firebaseapp.com",
      databaseURL: "https://web-uat-1a4d8.firebaseio.com",
      projectId: "web-uat-1a4d8",
      storageBucket: "web-uat-1a4d8.appspot.com",
      messagingSenderId: "732818088048"
    };
    platform.ready().then(() => {
      this.rootPage = LoginPage;
      firebase.initializeApp(config);
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          let loader = LoadingController.create({ content: '<img src="./assets/loading.gif"/>', spinner: 'hide' });
          loader.present();
          this.pushSetup(user.uid);
          this.rootPage = HomePage;
          loader.dismissAll();
        } else {
          this.pushObject = undefined;
          this.rootPage = LoginPage;
        }
        Splashscreen.hide();
      }, (e) => {
        this.rootPage = LoginPage;
        Splashscreen.hide();
      });
      StatusBar.styleDefault();
    });
  }

  pushSetup(uid) {
    const options: PushOptions = {
      "android": {
        "senderID": "732818088048",
        "sound": "true"
      },
      "ios": {
        "alert": "true",
        "badge": "true",
        "sound": "false"
      },
      "windows": {}
    }
    this.pushObject = this.push.init(options);
    this.listenPushObject(uid)
  }

  listenPushObject(uid) {
    this.pushObject.on('notification').subscribe((notification: any) => {
      let first = !notification.additionalData.foreground && notification.additionalData.coldstart;
      let background = !notification.additionalData.foreground && !notification.additionalData.coldstart;
      if (background) {
        let data = {
          additionalData: notification.additionalData,
          type: 'notification'
        }
        console.log('notification data run on background : ' + JSON.stringify(notification))
        if (notification.additionalData && notification.additionalData.typeNotif == 'review') {
          return this.helper.setDataNotif(notification)
        }
        // return this.helper.setDataNotif(data);
        return;
      }
      if (first) {
        let data = {
          additionalData: notification.additionalData,
          type: 'notification'
        }
        console.log('notification data run on first : ' + JSON.stringify(notification))
        return this.helper.setDataNotif(data);
      }
      console.log('notification data run on forground : ' + JSON.stringify(notification))
      return this.helper.setDataNotifFourground(notification)
    });

    this.pushObject.on('registration').subscribe((registration: any) => {
      console.log('registration push', registration)
      firebase.database().ref('users/' + uid).update({ deviceId: registration.registrationId, device: 'ios' })
    });
    this.pushObject.on('error').subscribe(error => console.log('plugin e rror', error));
  }
}

// const teacherPayload = {
//   data: {
//     title: `Ada Pesan Baru Dari ${studentProfile.firstName}`,
//     message: 'Harap membuka pesan anda',
//     type: 'user',
//     uid: student,
//     typeNotif: 'chat'
//   }
// };
// const studentPayload = {
//   data: {
//     title: `Ada Pesan Baru Dari ${teacherProfile.firstName}`,
//     message: 'Harap membuka pesan anda',
//     type: 'user',
//     uid: teacher,
//     typeNotif: 'chat'
//   }
// };
// const payload = {
//   data: {
//     title: `Ada Pesan Baru Dari CS`,
//     message: 'Harap membuka pesan anda',
//     type: 'cs',
//     uid: student,
//     typeNotif: 'chat'
//   }
// };