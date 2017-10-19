import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
/*
  Generated class for the ModalSchedule page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-schedule',
  templateUrl: 'modal-schedule.html'
})
export class ModalSchedulePage {
  time: any = { AM: {}, PM: {}, day: '', status: false };
  day: any = { name: {}, time: [] };
  lengths: any = [];
  rows: any = [];
  image: any;
  buttonAM: any = { 0: [], 1: [] };
  buttonPM: any = { 0: [], 1: [] };
  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.day.name = this.params.data.name;
    this.time.day = this.params.data.name;
    this.image = 'assets/' + this.day.name + '.png';
    console.log(this.params);
    if (this.params.data.data == undefined) {
      var i, t;
      for (i = 0; i != 6; i++) {
        this.lengths.push(i);
        // this.time.push(i);
        // this.time.push(i);
        // this.time[i+':00 AM']=false;
        // this.time[i+':00 PM']=false;
        this.buttonAM[0][i] = false;
        this.buttonPM[0][i] = false;
      }
      for (i = 6; i != 12; i++) {
        this.lengths.push(i);
        // this.time.push(i+':00 AM');
        // this.time.push(i+':00 PM');
        // this.time[i+':00 AM']=false;
        // this.time[i+':00 PM']=false;
        this.buttonAM[1][i] = false;
        this.buttonPM[1][i] = false;
      }
      for (i = 0; i != 12; i++) {
        this.time.AM[i] = false;
      }
      for (i = 0; i != 12; i++) {
        this.time.PM[i] = false;
      }
    }
    else {
      var i, t;
      for (i = 0; i != 6; i++) {
        this.lengths.push(i);
        // this.time.push(i);
        // this.time.push(i);
        // this.time[i+':00 AM']=false;
        // this.time[i+':00 PM']=false;
        this.buttonAM[0][i] = this.params.data.data.AM[i];
        this.buttonPM[0][i] = this.params.data.data.PM[i];
      }
      for (i = 6; i != 12; i++) {
        this.lengths.push(i);
        // this.time.push(i+':00 AM');
        // this.time.push(i+':00 PM');
        // this.time[i+':00 AM']=false;
        // this.time[i+':00 PM']=false;
        this.buttonAM[1][i] = this.params.data.data.AM[i];
        this.buttonPM[1][i] = this.params.data.data.PM[i];
      }
      for (i = 0; i != 12; i++) {
        this.time.AM[i] = this.params.data.data.AM[i];
      }
      for (i = 0; i != 12; i++) {
        this.time.PM[i] = this.params.data.data.PM[i];
      }
    }

    this.rows = Array.from(Array(Math.ceil(this.lengths.length / 6)).keys())
    console.log(this.time);
    console.log(this.lengths);
    console.log(this.buttonAM);
  }

  ionViewDidLoad() {
    console.log('Hello ModalSchedulePage Page');
  }
  selectHourAM(i, row) {
    if (i == 1) {
      row = row + 6;
    }
    console.log(i, row);
    if (this.buttonAM[i][row] == false) {
      this.buttonAM[i][row] = true;
      this.time.AM[row] = true;
    }
    else {
      this.buttonAM[i][row] = false;
      this.time.AM[row] = false;
    }
    console.log(this.time);
  }
  selectHourPM(i, row) {
    if (i == 1) {
      row = row + 6;
    }
    console.log(i, row);
    if (this.buttonPM[i][row] == false) {
      this.buttonPM[i][row] = true;
      this.time.PM[row] = true;
    } else {
      this.buttonPM[i][row] = false;
      this.time.PM[row] = false;

    }
    console.log(this.time);
  }
  submit() {
    console.log(this.time);
    console.log(_.includes(this.time.AM, true));
    if (_.includes(this.time.AM, true) == true || _.includes(this.time.PM, true) == true) {
      this.time.status = true;
    }
    this.viewCtrl.dismiss(this.time);
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

}
