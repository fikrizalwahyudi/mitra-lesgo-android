import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
// import { Midtrans  } from '../../providers/midtrans';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { DetailPage } from '../detail/detail';
import { OrderGuruPage } from '../order-guru/order-guru';

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
  providers: [UserService]
})
export class BookingPage {
  userEmail: any;
  token: any;
  uid: any;
  getData: any = [];
  butOff: any;
  total: any;
  subtotal: any;
  payment: any;
  promo: any;
  cartStatus: any;
  cartHistoryStatus: any;
  conFee: any = 0;
  lespay: any;
  cartData: any;
  historyData: any;
  orders: any = [];


  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService
  ) {
    var uid = this.params.get('uid');
    this.cartStatus = "empty";
    this.subtotal = 0;
    this.butOff = "pesan";
    this.payment = 'transfer';
    this.total = 0;
    this.cartData = [];
    this.getBooking(uid);

  }
  getBooking(uid) {
    this.userService.tutorCariMurid(uid).subscribe(snapshot => {
      this.orders = [];
      if (snapshot == undefined || snapshot.length == 0) {
        return;
      } else {
        snapshot.forEach((child) => {
          var data = child;
          data.key = child.$key;
          this.orders.push(data);
        })
        this.orders = _.groupBy(this.orders, 'status');
        console.log(this.orders);
      }
    })
  }
  onChange(name) {
    if (this.butOff != name) {
      this.butOff = name;
    }
    else {
      this.butOff = 'empty';
    }

  }
  bayar() { }
  theTotal() {
    if (this.payment == "transfer") {
      this.conFee = 5700;
    }
    else if (this.payment == 'creditcard') {
      this.conFee = this.subtotal / 100 * 3.2;
    }
    this.total = this.total + this.conFee;
  }
  orderDetail(order, status) {
    console.log('masuk');
    this.navCtrl.push(OrderGuruPage, { status: status, order: order });
  }
  orderDetailCart(orderid) {
    console.log('masuk');
    this.navCtrl.push(DetailPage, { orderid: 'orderid', data: orderid });
  }
  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
