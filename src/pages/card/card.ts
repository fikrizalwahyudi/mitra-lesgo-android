import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { HomePage } from '../home/home';
import { UserService } from '../../providers/user-service';

/*
  Generated class for the Card page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
  providers: [UserService]
})
export class CardPage {
  uid: any;
  dataUser: any = [];
  constructor(
    public userService: UserService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.uid = firebase.auth().currentUser.uid;
    this.displayUser(this.uid);
  }
  displayUser(uid) {
    this.userService.viewUser(uid).once('value').then(snapshot => {
      var data = snapshot.val();
      this.dataUser.id = data.id;
      this.dataUser.firstName = data.firstName;
      this.dataUser.lastName = data.lastName;
      this.dataUser.createDate = moment(data.createDate);
      this.dataUser.avatar = data.avatar;
      this.dataUser.stateVerification = data.stateVerification;
      this.userService.viewTutorProfile(uid).once('value').then(child => {
        this.dataUser.address = child.val().address;
      }, error => {
        alert('tutor profile does not exist ');
      })
    });
    console.log(this.dataUser);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }
  timeMask(date) {
    return moment(date).format("Do MMMM YYYY");
  }
  tutor() {
    console.log('update');
    firebase.database().ref('users/' + this.uid).update({ stateVerification: 7 });
    this.navCtrl.setRoot(HomePage);
  }
}
