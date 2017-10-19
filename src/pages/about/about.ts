import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [UserService],
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
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class AboutPage {

  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  email: any;

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public loadingCtrl: LoadingController
  ) { }
  forgetPass() {
    this.userService.forgotUser(this.email).then(authData => {
      alert("Password telah dikirim ke email anda");
    }, error => {
      alert("Email anda tidak terdaftar");
    });
  };
}
