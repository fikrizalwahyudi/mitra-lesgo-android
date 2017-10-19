import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';

/*
  Generated class for the Interview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-interview',
  templateUrl: 'interview.html'
})
export class InterviewPage {

  jawaban: any = [{ pertanyaan: " Apakah anda memiliki pengalaman mengajar ?", jawaban: "" }, { pertanyaan: "Berapa lama pengalaman mengajar anda dan dimana ?", jawaban: "" }, { pertanyaan: "Silahkan ceritakan diri Anda kepada LESGO!?", jawaban: "" }, { pertanyaan: "Seberapa yakin Anda dapat mengajar sesuai dengan bidang yang telah Anda pilih? Jelaskan alasannya ?", jawaban: "" },
  { pertanyaan: "Apa yang akan Anda lakukan sebagai seorang Guru jika anak murid Anda mengabaikan  kehadiran Anda ?", jawaban: "" }, { pertanyaan: "Bagaimana cara Anda sebagai Guru untuk menciptakan suasana belajar yang nyaman bagi anak murid Anda ?", jawaban: "" }, { pertanyaan: "Bagaimana tanggapan Anda jika memiliki murid yang tidak bersemangat untuk belajar ?", jawaban: "" }];
  uid: any;
  status: any = false;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
    this.uid = this.navParams.get('dataUser').uid;
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterviewPage');
  }
  jawabBenar() {
    firebase.database().ref('interview').child(this.uid).set(this.jawaban).then(() => {
      firebase.database().ref('users').child(this.uid).update({ stateVerification: 4 }).then(() => {
        this.navCtrl.pop();
        this.status = true;
      })
    });

  }
  getData() {
    firebase.database().ref('interview').child(this.uid).once('value').then(snapshot => {
      // this.checkData(snapshot.val());÷
      console.log(snapshot.val());
      if (snapshot.val() != undefined) {
        this.status = true;
      } else {
        this.status = false;
      }
    })
  }
  checkData(data) {
  }
  getPertanyaan() {
    //firebase.database.ref('questions').once('value');
  }
  logout() {
    this.platform.exitApp();
  }

}
