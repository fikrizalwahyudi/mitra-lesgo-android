import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import * as firebase from 'firebase';

/*
  Generated class for the Review page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-absensi',
  templateUrl: 'absensi.html',
  providers: [UserService]
})
export class AbsensiPage {
  timeLine: any;
  userId: any = { name: '', avatar: '' };
  types: any;
  datex: any;
  dataUser: any = { rate: 0, review: "" };
  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    // this.userId = firebase.auth().currentUser.uid;
    console.log(this.navParams);
    this.types = this.navParams.get('type');
    this.datex = new Date().toLocaleDateString();
    this.userId.name = this.navParams.get('name');
    this.userId.avatar = this.navParams.get('avatar');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }
  submitReview() {
    this.viewCtrl.dismiss(this.dataUser);
  }
}
