import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import * as _ from 'lodash';
import { Helper } from '../../providers/Helper';

/*
  Generated class for the Review page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
  providers: [UserService]
})
export class ReviewPage {
  timeLine: any;
  segmentPage: any;
  rate: any = 0;
  uid: any;
  user: any = [];
  data: any = [];
  profile: any = [];
  review: any = [];
  subscriber: any;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public userService: UserService,
    public helper: Helper,
  ) {
    this.uid = this.navParams.get('uid');
    this.profile = this.navParams.get('dataUser');
    this.getData();
    this.getReview();
    if (this.navParams.get('notification')) {
      this.segmentPage = 'Review';
    }
    this.subscriber = this.helper.emitterReview.subscribe((res: any) => {
      this.segmentPage = 'Review';
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
    console.log('in review')
  }
  ionViewWillLeave() {
    this.subscriber.unsubscribe();
  }
  getReview() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.userService.getTutorReview(this.uid).subscribe(sabi => {
      if (sabi.length > 0) {
        this.review = sabi;
        sabi.forEach(e => {
          this.rate = this.rate + e.rate;
        })
        this.rate = Math.ceil(this.rate / this.review.length);
      }
      loader.dismiss();
    })
  }
  getData() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.userService.tutorCariMurid(this.uid).subscribe(snapshot => {
      var data = snapshot
      var order: any = [];
      var today = new Date();
      var month = today.getMonth();
      var year = today.getFullYear();
      order.monthly = [];
      order.yearly = [];
      this.user.session = [];
      this.user.revenue = [];
      this.user.order = [];
      this.user.session.cum = 0;
      this.user.revenue.cum = 0;
      this.user.order.cum = 0;
      this.user.session.monthly = 0;
      this.user.revenue.monthly = 0;
      this.user.order.monthly = 0;
      this.user.session.yearly = 0;
      this.user.revenue.yearly = 0;
      this.user.order.yearly = 0;
      if (snapshot.length > 0) {
        this.user.order.cum = data.length;
        snapshot.forEach(e => {
          var date = new Date(e.orderSchedule.startDate);
          if (e.status == 'finish') {
            if (date.getMonth() == month) {
              order.monthly.push(e);
            }
            if (date.getFullYear() == year) {
              order.yearly.push(e);
            }
            this.user.revenue.cum = this.user.revenue.cum + e.totalHarga;
            // this.review.push({review:e.review,date:e.orderSchedule.endDate});
            // this.rate= this.rate + e.rate;
            this.user.session.cum = this.user.session.cum + e.sessions.length;
          }
        })
        this.user.order.monthly = order.monthly.length;
        this.user.order.yearly = order.yearly.length;
        this.user.revenue.monthly = _.sumBy(order.monthly, 'totalHarga');
        this.user.revenue.yearly = _.sumBy(order.yearly, 'totalHarga');
        this.user.session.monthly = _.sumBy(order.monthly, 'sessions.length');
        this.user.session.yearly = _.sumBy(order.yearly, 'sessions.length');
        // this.rate = Math.ceil(this.rate / this.review.length);
        // console.log(this.rate);
        // console.log(this.review);
      }
      console.log(this.user);
      loader.dismiss();
    })
  }
  // getData(){
  //   var that=this;
  //   this.userService.viewTutorProfile(this.uid).once('value',function(snapshot){
  //     this.user=snapshot.val();
  //   }).then((getTotal)=>{
  //     this.user.session.cum=0;
  //     this.user.revenue.cum=0;
  //     this.user.order.cum=0;
  //     this.user.session.monthly=0;
  //     this.user.revenue.monthly=0;
  //     this.user.order.monthly=0;
  //     this.user.session.yearly=0;
  //     this.user.revenue.yearly=0;
  //     this.user.order.yearly=0;
  //     this.userService.getBooking(this.uid).on('value',function(snapshot){
  //       snapshot.forEach(function(fuck){
  //         var dats = fuck.val();
  //         dats.month = new Date(dats.orderSchedule.startDate).getMonth();
  //         dats.year = new Date(dats.orderSchedule.startDate).getFullYear();
  //         dats.totalSession = dats.session.length;
  //         this.user.session.cum=this.user.session.cum+dats.session.length
  //         this.user.revenue.cum=this.user.revenue.cum+dats.totalHarga;
  //         this.data.push(dats);
  //       })
  //     this.userService.getBooking(this.uid).on('value',function(snapshot){
  //       snapshot.forEach(function(fuck){
  //         var dats = fuck.val();
  //         dats.month = new Date(dats.orderSchedule.startDate).getMonth();
  //         dats.year = new Date(dats.orderSchedule.startDate).getFullYear();
  //         dats.totalSession = dats.session.length;
  //         this.user.session.cum=this.user.session.cum+dats.session.length
  //         this.user.revenue.cum=this.user.revenue.cum+dats.totalHarga;
  //         this.data.push(dats);
  //       })
  //     }).then((review)=>{
  //       this.userService.getReview(this.uid).on('value',function(snapshot){
  //         snapshot.forEach(function(review){
  //           var datsky = review.val();
  //           this.review.push(datsky);
  //         })
  //       });
  //       var date=new Date();
  //       var month = date.getMonth();
  //       var year = date.getFullYear();
  //       this.user.order.monthly=_.filter(this.data, {month:month}).length;
  //       this.user.order.yearly=_.filter(this.data, {year:year}).length;
  //       this.user.order.cum=this.data.length;
  //       this.user.session.monthly=_.filter(this.data, {month:month});
  //       this.user.session.yearly=_.filter(this.data, {year:year});
  //       })
  //     })
  //   })
  // }
}
