import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { CardPage } from '../card/card';
import * as firebase from 'firebase';

/*
  Generated class for the Letter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-letter',
  templateUrl: 'letter.html',
  providers: [UserService]
})
export class LetterPage {
  uid: any;
  agree: any = false;
  constructor(
    public alertCtrl: AlertController,
    public userService: UserService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.uid = this.navParams.get('dataUser').uid;
  }

  jawabBenar() {
    // firebase.database.ref('interview').child(uid).set(this.jawaban)
    if (this.agree == true) {
      firebase.database().ref('users/' + this.uid).update({ stateVerification: 6 });
      this.navCtrl.pop();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Belum Setuju', message: 'Harap menyetujui pernyataan ini untuk melanjutkan proses verifikasi',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              return true;
            }
          }
        ]
      })
      alert.present();
    }

  }

}
