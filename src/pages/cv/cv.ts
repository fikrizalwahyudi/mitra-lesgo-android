import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import { VerificationPage } from '../verification/verification';
import { LoginPage } from '../login/login';
import { BlankPage } from '../blank/blank';
import { HomePage } from '../home/home';
import { UserService } from '../../providers/user-service';
import { MapsPage } from '../maps/maps';
import { Zapier } from '../../providers/zapier';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';
import { TextMaskModule } from 'angular2-text-mask';

@Component({
  selector: 'page-cv',
  templateUrl: 'cv.html',
  providers: [UserService, Zapier],
  animations: [
    //logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void=> *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void  =>  *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void =>  *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void  =>  *', [
        style({ opacity: 0 }),
        animate('500ms 1000ms ease-in')
      ])
    ])
  ]
})
export class CvPage {
  uid: any;
  edukasi: any[] = [{ startYear: '', endYear: '', university: '', major: '', tingkatPendidikan: '', gpa: null, present: false }];
  work: any[] = [{ startYear: '', endYear: '', company: '', position: '', jobDesc: '', present: false }];

  mask: any = ['+', '6', '2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  fireAuth: any;

  constructor(
    public params: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public userService: UserService,
    public zapier: Zapier,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.uid = this.params.data.uid;
    this.getCVData(this.params.data.uid);
    console.log(this.params.data.uid);
  }

  getCVData(uid) {
    console.log(uid);
    setTimeout(() => {
      var loadingCtrl = this.loadingCtrl.create({
        content: '<img src="./assets/loading.gif"/>',
        spinner: 'hide'
      });
      loadingCtrl.present();
      this.userService.getCV(uid).subscribe(snapshot => {
        var obj = snapshot.val();
        console.log(snapshot);
        console.log(obj);
        if (obj == null) {
          this.userService.setCv(this.uid, this.work, this.edukasi).then(() => {
            return loadingCtrl.dismiss();
          })

        } else if (obj.length == 0) {
          this.userService.setCv(this.uid, this.work, this.edukasi).then(() => {
            return loadingCtrl.dismiss();
          })
        } else {
          this.edukasi = obj.edukasi;
          this.work = obj.work;
          return loadingCtrl.dismiss();
        }
      });
    }, 400)
  }
  tambah(traits) {
    if (traits == 'edukasi') {
      this.edukasi.push({ startYear: '', endYear: '', university: '', major: '', tingkatPendidikan: '', gpa: null, present: false });
    } else {
      this.work.push({ startYear: '', endYear: '', company: '', position: '', jobDesc: '', present: false });
    }
  }
  submit() {
    for (var i = 0; i < this.edukasi.length; i++) {
      if (!this.edukasi[i].startYear || (!this.edukasi[i].endYear && !this.edukasi[i].present) || !this.edukasi[i].university || !this.edukasi[i].major || !this.edukasi[i].tingkatPendidikan) {
        return alert('Harap lengkapi detail edukasi yang belum terisi');
      }
      if (parseFloat(this.edukasi[i].gpa) != this.edukasi[i].gpa) {
        return alert('GPA harus di isi angka');
      }
    }
    for (var i = 0; i < this.work.length; i++) {
      if (!this.work[i].startYear || (!this.work[i].endYear && !this.work[i].present) || !this.work[i].position || !this.work[i].jobDesc) {
        return alert('Harap lengkapi detail Pengalaman yang belum terisi');
      }
    }
    this.edukasi.map((v: any) => {
      if (v.tingkatPendidikan == 'SMA') v.codePendidikan = 1;
      if (v.tingkatPendidikan == 'D3') v.codePendidikan = 2;
      if (v.tingkatPendidikan == 'S1') v.codePendidikan = 3;
      if (v.tingkatPendidikan == 'S2') v.codePendidikan = 4;
      if (v.tingkatPendidikan == 'S3') v.codePendidikan = 5;
      return v;
    })
    this.edukasi.sort((curr: any, next: any) => {
      return curr.codePendidikan - next.codePendidikan;
    })
    console.log('this.edukasi', this.edukasi)
    this.edukasi.forEach((v: any) => {
      delete v.codePendidikan;
      return v;
    })
    console.log('this.edukasi', this.edukasi)
    console.log('this.work', this.work)
    this.userService.updateCv(this.uid, this.work, this.edukasi).then(() => {
      return this.viewCtrl.dismiss('success');
    })
  }
  goBack() {
    return this.viewCtrl.dismiss('gagal');
  }
  checkNilai(i) {
    var data = this.edukasi[i].gpa;
    console.log(parseFloat(data));
    if (parseFloat(data) == undefined) {
      return this.edukasi[i].gpa = null
    } else if (parseFloat(data) > 4) {
      return this.edukasi[i].gpa = null
    } else {
      return this.edukasi[i].gpa = parseFloat(data);
    }
  }
  updatePresent(index, type) {
    console.log(index, type);
    if (type == 'work') {
      console.log(this.work[index].present);
      this.work[index].present = !this.work[index].present;
    } else if (type == 'edukasi') {
      console.log(this.edukasi[index].present);
      this.edukasi[index].present = !this.edukasi[index].present;
    }
  }
  removeWork(i: number) {
    this.work.splice(i, 1)
  }
  removeEdukasi(i: number) {
    this.edukasi.splice(i, 1)
  }
  // phoneMask(e){  
  //   return e = ['+', '6','2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/ , /\d/];
  //
  // }

}
