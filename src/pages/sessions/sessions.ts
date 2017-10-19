import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ViewChild } from '@angular/core';
/*
  Generated class for the Sessions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sessions',
  templateUrl: 'sessions.html'
})
export class SessionsPage {

  ticks = 0;
  sec = 0;
  mins = 0;
  hours = 0;
  constructor(
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    let timer = Observable.timer(1000, 1000);
    timer.subscribe(t => this.tickerFunc(t));
  }
  tickerFunc(tick) {
    this.ticks++;
    this.sec++;
    if (Math.floor(this.sec / 60) >= 1) {
      this.sec = this.sec - 60;
      this.mins = this.mins + 1;
    }
    if (Math.floor(this.mins) / 60 >= 1) {
      this.mins = this.mins - 60;
      this.hours = this.hours + 1;
    }
  }
  endTimer() {
    this.viewCtrl.dismiss(this.ticks);
  }

}
