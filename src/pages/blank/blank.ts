import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
/*
  Generated class for the Blank page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-blank',
  templateUrl: 'blank.html'
})
export class BlankPage {
  pageName: any;
  data: any;
  constructor(
    public navCtrl: NavController,
    public params: NavParams
  ) {
    console.log(this.params.get('data1'));
    this.pageName = this.params.get('data1')
    //     DatePicker.show({
    //   date: new Date(),
    //   mode: 'date'
    // }).then(
    //   date => console.log('Got date: ', date),
    //   err => console.log('Error occurred while getting date: ', err)
    // );
  }

}
