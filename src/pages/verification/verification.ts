import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { SchedulePage } from '../schedule/schedule';
import { KelasPage } from '../kelas/kelas';
import { LetterPage } from '../letter/letter';
import { CardPage } from '../card/card';
import { InterviewPage } from '../interview/interview';
import { UserService } from '../../providers/user-service';
import * as firebase from 'firebase';

/*
  Generated class for the Verification page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
  providers: [UserService]
})
export class VerificationPage {
  dataUser: any = [];
  dataTutor: any = [];
  myUserId: any = [];
  button: any = [];

  constructor(
    public userService: UserService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {

  }
  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      dismissOnPageChange: true,
      spinner: 'hide'
    })
    loading.present();
    this.myUserId = firebase.auth().currentUser.uid;
    this.displayUser();
    // this.tutorData();
    loading.dismiss();

  }

  navigateMe(name) {
    if (name == 'ProfilePage') {
      this.navCtrl.push(ProfilePage, { dataUser: this.dataUser, stateVerification: this.dataUser.stateVerification });
    }
    else if (name == 'SchedulePage') {
      this.navCtrl.push(SchedulePage, { dataUser: this.dataUser, schedule: this.dataTutor.schedule, stateVerification: this.dataUser.stateVerification });
    }
    else if (name == 'InterviewPage') {
      this.navCtrl.push(InterviewPage, { dataUser: this.dataUser, stateVerification: this.dataUser.stateVerification });
    }
    else if (name == 'KelasPage') {
      this.navCtrl.push(KelasPage, { dataUser: this.dataUser, stateVerification: this.dataUser.stateVerification });
    }
    else if (name == 'LetterPage') {
      this.navCtrl.push(LetterPage, { dataUser: this.dataUser, stateVerification: this.dataUser.stateVerification });
    }
    else if (name == 'CardPage') {
      this.navCtrl.push(CardPage, { dataUser: this.dataUser, stateVerification: this.dataUser.stateVerification, source: 'verification' });
    }

  }
  displayUser() {
    this.userService.viewUser(this.myUserId).once('value').then(snapshot => {
      var data = snapshot.val();
      data.key = snapshot.key;
      data.uid = snapshot.key;
      this.assignDataUser(data);
    }); XPathEvaluator
  }
  // tutorData(){
  //   var that = this;
  //   var data=[];
  //   that.userService.viewTutorProfile(that.myUserId).once('value').then(snapshotData => {
  //     that.assignDataTutor(snapshotData.val());
  //   });
  // }
  // assignDataTutor(data){
  //   this.dataTutor=data;
  // }
  assignDataUser(data) {
    this.dataUser = data;
    if (data.stateVerification == 3 || data.stateVerification == 4) {
      this.navCtrl.push(InterviewPage, { dataUser: data, stateVerification: data.stateVerification });
    } else if (data.stateVerification == 5) {
      this.navCtrl.push(LetterPage, { dataUser: data, stateVerification: data.stateVerification });
    }
  }
}
