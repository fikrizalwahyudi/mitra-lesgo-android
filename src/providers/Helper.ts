import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the Email provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Helper {
  dataNotif: any;
  dataNotifFourground: any;
  dataOrderGuru: any;
  dataReview: any;
  emitterNotif: EventEmitter<any>;
  emiterNotifFourground: EventEmitter<any>;
  emitterOrderGuru: EventEmitter<any>;
  emitterReview: EventEmitter<any>;
  user: any;
  constructor() {
    if (!this.emitterNotif) this.emitterNotif = new EventEmitter<any>();
    if (!this.emiterNotifFourground) this.emiterNotifFourground = new EventEmitter<any>();
    if (!this.emitterOrderGuru) this.emitterOrderGuru = new EventEmitter<any>();
    if (!this.emitterReview) this.emitterReview = new EventEmitter<any>();
  }
  setDataNotif(data: any) {
    this.dataNotif = data;
    this.emitterNotif.emit(data);
  }
  setDataNotifFourground(data: any) {
    this.dataNotifFourground = data;
    this.emiterNotifFourground.emit(data);
  }

  setDataOrderGuru(data: any) {
    this.dataOrderGuru = data;
    this.emitterOrderGuru.emit(data);
  }

  setDataReview(data) {
    this.dataReview = data;
    this.emitterReview.emit(data);
  }

  getDataOrderGuru() {
    return this.dataOrderGuru;
  }

  getDataNotif() {
    return this.dataNotif;
  }
  getuser() {
    return this.user;
  }
  setUser(user: any) {
    this.user = user;
  }
}
