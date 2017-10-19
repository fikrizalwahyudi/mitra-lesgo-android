import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SessionsPage } from '../sessions/sessions';;
import { AbsensiPage } from '../absensi/absensi';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { KonsultasiPage } from '../konsultasi/konsultasi';
import { UserService } from '../../providers/user-service';
import { Zapier } from '../../providers/zapier';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/Helper';
import { Observable } from 'rxjs/Rx';
/*
  Generated class for the OrderGuru page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-guru',
  templateUrl: 'order-guru.html',
  providers: [UserService, CallNumber, SMS, Zapier]
})
export class OrderGuruPage {
  iconDetails: any;
  sessionActive: any;
  rate: any = 5;
  data: any = [];
  status: any;
  course: any;
  theSesi: any;
  profile: any = { firstName: 'Hery', lastName: ' Prasetyo', location: 'Jl Abdul Majid no 65', label: 'Universitas Indonesia' };
  subscriber: any;
  countChat: any = 0;
  subscriberChat: any;
  statusSubscriber: string;
  dataSubscriber: any;
  constructor(
    public zapier: Zapier,
    public alertCtrl: AlertController,
    public SMS: SMS,
    public CallNumber: CallNumber,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public params: NavParams,
    public modal: ModalController,
    public userService: UserService,
    public helper: Helper,
  ) {
    this.subscriber = this.helper.emitterOrderGuru.subscribe((res: any) => {
      this.data = res.order;
      this.status = res.status;
      this.dataSubscriber = res.order;
      this.statusSubscriber = res.status;
      let loader = this.loadingCtrl.create({
        content: '<img src="./assets/loading.gif"/>',
        spinner: 'hide',
      });
      loader.present()
      this.getName().take(1).subscribe((res) => {
        this.chatNotificationMurid()
        loader.dismissAll()
      })
    })
  }

  ionViewWillEnter() {
    this.data = this.params.get('order');
    this.status = this.params.get('status');
    console.log('this.data', this.data)
    if (this.data) {
      this.data = this.dataSubscriber || this.data;
      this.status = this.statusSubscriber || this.status;
      this.dataSubscriber = undefined;
      this.statusSubscriber = undefined;
      let loader = this.loadingCtrl.create({
        content: '<img src="./assets/loading.gif"/>',
        spinner: 'hide',
      });
      loader.present()
      this.getName().take(1).subscribe((res) => {
        this.chatNotificationMurid()
        loader.dismissAll()
      })
    }
  }

  ionViewWillLeave() {
    if (this.subscriber) this.subscriber.unsubscribe();
    if (this.subscriberChat) this.subscriberChat.unsubscribe();
  }
  sessionDetail(sessionId) {
    if (this.sessionActive != sessionId) {
      this.sessionActive = sessionId;
      this.iconDetails = 'ios-arrow-down-outline';
    }
    else {
      this.sessionActive = null;
      this.iconDetails = 'ios-arrow-forward-outline';
    }
  }
  getName() {
    return new Observable((observer: any) => {
      this.userService.getUserDataOnce(this.data.uid).subscribe(snapMe => {
        this.data.userName = snapMe.val().firstName;
        this.data.fullName = snapMe.val().firstName + ' ' + snapMe.val().lastName;
        this.data.deviceId = snapMe.val().deviceId;
        this.data.email = snapMe.val().email;
        this.data.userPhone = snapMe.val().phoneNumber;
        observer.next();
        observer.complete();
      })
    })
  }
  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  startLesson(index) {
    //console.log(key);
    if (moment(this.data.sessions[index].date).format('MM-DD-YYYY') != moment(new Date()).format('MM-DD-YYYY')) {
      let tutorAlert = this.alertCtrl.create({
        title: 'Maaf sesi tersebut belum dapat dimulai',
        enableBackdropDismiss: false,
        message: 'Sesi dapat dimulai pada tanggal ' + moment(this.data.sessions[index].date).format('MM-DD-YYYY'),
        buttons: [
          {
            text: 'Dismiss',
            handler: () => {
              return true;
            }
          }
        ]
      });
      tutorAlert.present();
    } else {
      var a = new Date();
      var hour = a.getHours(),
        minutes = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
      var send = hour + ':' + minutes;
      this.data.sessions[index].jamStart = send;
      this.userService.updateSessionTime(this.data.key, index, { jamStart: send });
    }

  }

  endLesson(index) {
    var a = new Date();
    var hour = a.getHours(),
      minutes = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var send = hour + ':' + minutes;
    this.data.sessions[index].jamEnd = send;
    this.userService.updateSessionTime(this.data.key, index, { jamEnd: send });
    let absen = this.modal.create(AbsensiPage, { type: 'absen', avatar: this.data.avatarMurid, name: this.data.namaMurid });
    absen.present();
    absen.onDidDismiss(datsky => {
      this.data.sessions[index].review = datsky.review;
      this.data.sessions[index].status = 'finish';
      this.userService.updateSession(this.data.key, this.data);
      // if (this.data.deviceId != null && this.data.deviceId != undefined) {
      //   let notifGuruObj = { title: 'Evaluasi Belajar ' + this.data.namaMurid, message: datsky.review, to: this.data.deviceId };
      //   this.zapier.sendNotification(notifGuruObj).subscribe(() => {
      //     return;
      //   })
      // }
    });
  }
  endOrder() {
    var check = this.data.sessions.length - 1;
    if (this.data.sessions[check].status == 'finish') {
      let review = this.modal.create(AbsensiPage, { type: 'review', avatar: this.data.avatarMurid, name: this.data.namaMurid });
      review.present();
      review.onDidDismiss(datsky => {
        this.store();
        this.data.rate = datsky.rate;
        this.data.review = datsky.review;
        this.data.status = 'finish';
        let objEmail = {
          userName: this.data.fullName, title: 'Laporan Belajar ' + this.data.key, to: this.data.email, welcome: "Hi",
          message: "<p>Order ID " + this.data.key + " a.n. " + this.data.namaMurid + " dengan Guru " + this.data.tutorName + " telah selesai.</p><p>Berikut laporan belajar yang telah dijalankan :</p>" + this.theSesi,
          thanks: 'Terima Kasih',
          thanksMessage: 'Tasya'
        };
        this.zapier.sendDirectEmail(objEmail).subscribe(hasilOrder => {
          console.log(objEmail)
          // if (this.data.deviceId != null && this.data.deviceId != undefined) {
          //   let message = this.data.namaMurid + ", saat ini order Anda dengan Order ID " + this.data.key + " telah selesai. Harap lakukan review terhadap Guru Anda";
          //   let notifGuruObj = {
          //     title: 'Order telah selesai',
          //     message: message,
          //     to: this.data.deviceId,
          //     tutorUid: this.data.tutorUid,
          //     name: this.data.tutorName,
          //     avatar: this.data.tutorAvatar
          //   };
          //   this.zapier.sendNotification(notifGuruObj).subscribe(mintaReview => {
          //     this.userService.updateSession(this.data.key, this.data).then(success => {
          //       this.navCtrl.pop()
          //     });
          //     console.log(notifGuruObj);
          //   })
          // }
        })
      })
    } else {
      alert('Maaf order belum selesai');
    }
  }


  chatNotificationMurid() {
    if (this.subscriberChat) {
      this.subscriberChat.unsubscribe();
    }
    this.subscriberChat = this.userService.getKonsultasiStatus(this.data.uid, this.data.tutorUid).subscribe(snapshot => {
      console.log(snapshot);
      this.countChat = 0;
      if (snapshot.length != 0) {
        snapshot.forEach(o => {
          if (o.status == false) {
            this.countChat++;
          }
        })
      }
    })
  }
  callMe() {
    if (this.data.userPhone) this.CallNumber.callNumber(this.data.userPhone, true);
  }
  smsMe() {
    let alert = this.alertCtrl.create({
      title: 'Kirim SMS ke tutor anda',
      message: 'harap isi pesan dibawah',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'pesan',
          placeholder: 'Pesan anda'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Kirim',
          handler: datas => {
            if (this.data.userPhone) this.SMS.send(this.data.userPhone, datas.pesan);
          }
        }
      ]
    });
    alert.present();
  }
  chatMe() {
    this.countChat = 0;
    this.navCtrl.push(KonsultasiPage, { data: this.data.tutorUid, muridUid: this.data.uid, muridData: this.data, muridName: this.data.userName });
  }
  store() {
    this.theSesi = "<p><table><tbody><tr><td>Sesi</td><td>Hari/Tanggal</td><td>Jam</td><td>Evaluasi Guru</td></tr>"
    for (let i = 0; i < this.data.sessions.length; i++) {
      var test = i + 1;
      test.toString();
      this.theSesi = this.theSesi + "<tr><td>" + test + "</td><td>" + moment(this.data.sessions[i].date).format('DD MMM YYYY').toString() + "</td><td>" + this.data.sessions[i].jamStart + "</td><td>" + this.data.sessions[i].review + "</td></tr>";
      if (i == this.data.sessions.length - 1) {
        this.theSesi = this.theSesi + "</tbody></table></p><p>Silahkan hubungi Customer Service, apabila laporan tidak sesuai melalui <a>contact@les-go.com</a> atau hubungi Customer Service LESGO! di  +6281285552245.</p> <p>Terima kasih telah menggunakan layanan LESGO!. Kami akan terus berupaya untuk memberikan pelayanan yang terbaik.</p>";
      }
    }
  }
}
