import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { KonsultasiPage } from '../konsultasi/konsultasi';

/*
  Generated class for the OrderDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
  providers: [UserService]
})
export class OrderDetailPage {
  data: any = [];
  userData: any = [];
  constructor(
    public alertCtrl: AlertController,
    public SMS: SMS,
    public CallNumber: CallNumber,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService
  ) {
    this.data = params.data.data;
    console.log(this.data);
  }

  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  timeMask(e) {
    var a = new Date(e);
    var months = new Array(12);
    months[0] = "January";
    months[1] = "February";
    months[2] = "Maret";
    months[3] = "April";
    months[4] = "May";
    months[5] = "June";
    months[6] = "July";
    months[7] = "August";
    months[8] = "September";
    months[9] = "October";
    months[10] = "November";
    months[11] = "Desember";

    var month = a.getMonth(),
      date = a.getDate(),
      year = a.getFullYear();
    return date + '-' + months[month - 1] + '-' + year;
  }
  callMe() {
    let alert = this.alertCtrl.create({
      title: 'Telepon Tutor ?',
      message: 'Apakah anda ingin menelepon ' + this.data.tutorName + ' ?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.CallNumber.callNumber(this.data.phoneNumber, true);
          }
        }
      ]
    });
    alert.present();
    this.CallNumber.callNumber(this.data.phoneNumber, true);
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
            this.SMS.send(this.data.phoneNumber, datas.pesan);
          }
        }
      ]
    });
    alert.present();
  }
  chat() {
    this.navCtrl.push(KonsultasiPage, { data: this.data.uid, tutorUid: this.data.tutorId });
  }
}
