import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import { UserService } from '../../providers/user-service';
import * as _ from 'lodash';
import * as firebase from 'firebase';
import { TextMaskModule } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

/*
  Generated class for the Kelas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-kelas',
  templateUrl: 'kelas.html',
  providers: [ListCat, UserService]
})
export class KelasPage {
  uid: any;
  sendData: any = [];
  sendDataUmum: any = [];
  categoryData: any = [];
  umum: any = [];
  stateVerification: any;
  // data: Array<{name: string, details: string, icon: string, showDetails: boolean}> = [];
  data: any = [];
  userProduct: any = [];
  mask = createNumberMask({
    includeThousandsSeparator: true,
    prefix: '',
    thousandsSeparatorSymbol: '.' // This will put the dollar sign at the end, with a space.
  })

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public params: NavParams,
    public listCat: ListCat,
    public loadingCtrl: LoadingController,
    public userService: UserService
  ) {
    this.uid = this.params.get('dataUser').uid;
    this.stateVerification = this.params.get('stateVerification');

    // this.getCategory();
    this.categories();
    // this.getData(this.uid);
  }

  toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-add-circle-outline';
    } else {
      data.showDetails = true;
      data.icon = 'ios-remove-circle-outline';
    }
  }
  showHide(status, index) {
    if (status == false) {
      this.categoryData[index]['status'] = true;
    } else {
      this.categoryData[index]['status'] = false;
    }
  }
  sendValue(a, i, data) {
    // console.log(a,i,data);
    if (this.categoryData[a]['courses'][i]['class'] != 'active') {
      this.categoryData[a]['courses'][i]['class'] = 'active';
      this.sendData[a]['courses'][i] = data;
    } else {
      this.sendData[a]['courses'][i]['class'] = 'inactive';
      this.categoryData[a]['courses'][i]['class'] = 'inactive';
    }
    // console.log(this.sendData);
  }
  sendValueUmum(a, i, data) {
    if (this.umum[0].data[a]['courses'][i]['class'] != 'active') {
      this.umum[0].data[a]['courses'][i]['class'] = 'active';
      this.sendData[5].data[a]['courses'][i] = data;
    } else {
      this.sendData[5].data[a]['courses'][i]['class'] = 'inactive';
      this.umum[0].data[a]['courses'][i]['class'] = 'inactive';
    }
    // console.log(this.umum[0].data[a].courses[i]);
    // console.log(a);
    // console.log(i);
    // console.log(data);
  }

  dismiss() {
    this.navCtrl.pop();
  }
  send() {
    console.log(this.sendData)
    if (this.sendDataUmum != undefined) {
      this.sendDataUmum = this.sendData[5].data;
      _.remove(this.sendDataUmum, { price: '' });
      console.log(this.sendDataUmum);
      for (let i = 0; i < this.sendDataUmum.length; i++) {
        _.remove(this.sendDataUmum[i].courses, { class: 'inactive' });
        this.sendDataUmum[i].price = this.currencyToNum(this.sendDataUmum[i].price.replace(".", ""));
      }
    }
    _.remove(this.sendData, { price: '' });
    if (this.sendData.length == 0 && this.sendDataUmum.length == 0) {
      this.presentAlert('Tidak ada produk yang terpilih, silahkan cek apabila anda belum memasukkan harga');
      return;
    }
    for (let i = 0; i < this.sendData.length; i++) {
      this.sendData[i].price = this.currencyToNum(this.sendData[i].price.replace(".", ""));
      _.remove(this.sendData[i].courses, { class: 'inactive' });
    }
    // this.sendData=_.chain(this.sendData)
    //                 .groupBy('parentId')
    //                 .toPairs()
    //                 .value();
    for (let i = 0; i < this.sendData.length; i++) {
      if (this.sendData[i].productId != undefined) {
        this.listCat.updateProduct(this.sendData[i], this.sendData[i].key, this.uid);

      }
      else {
        this.listCat.newProduct(this.sendData[i], this.sendData[i].key, this.uid);
      }
    }
    if (this.sendDataUmum != undefined) {
      for (let i = 0; i < this.sendDataUmum.length; i++) {
        if (this.sendDataUmum[i].productId != undefined) {
          this.listCat.updateProduct(this.sendDataUmum[i], this.sendDataUmum[i].key, this.uid);

        }
        else {
          this.listCat.newProduct(this.sendDataUmum[i], this.sendDataUmum[i].key, this.uid);
        }
      }
    }
    if (this.stateVerification == 2) {
      this.stateVerification = 3;
      firebase.database().ref('users/' + this.uid).update({ stateVerification: 3 });
      this.presentAlert('Produk anda telah tersimpan')
      return this.navCtrl.pop();

    }
    this.presentAlert('Perubahan product sedang menunggu approval')
    this.navCtrl.pop();
  }

  categories() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.listCat.getCourses().once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var raw = childSnapshot.val();
        raw.id = childSnapshot.key;
        raw.text = raw.name;
        var key = childSnapshot.parentId;
        raw.class = 'inactive';
        this.data.push(raw);
      });
      // console.log(this.categoryData);
      // console.log(this.data);
    }).then((getCat) => {
      this.listCat.getCategory().once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var data = childSnapshot.val();
          data.key = childSnapshot.key;
          data.show = false;
          data.price = '';
          data.status = false;
          if (data.key != -1) {
            this.sendData.push(data);
            data.courses = _.remove(this.data, { parentId: data.key })
            this.categoryData.push(data);
          }
        })
        this.listCat.getTeacherProducts(this.uid).once('value', (snapshot) => {
          console.log('xxxx')
          console.log(snapshot.val());
          if (snapshot.val() != undefined || snapshot.val() != null) {
            snapshot.forEach((childSnapshot) => {
              if (childSnapshot.val() != undefined) {
                // console.log('nih child snapshot');
                // console.log(childSnapshot.val());
                var dats = childSnapshot.val();
                dats.productId = childSnapshot.key;
                // console.log(childSnapshot.key);
                var index = _.findIndex(this.categoryData, { key: dats.categoryId });
                var indexDat = _.findIndex(this.sendData, { key: dats.categoryId });
                // console.log(index);
                if (childSnapshot.val().courses && childSnapshot.val().courses.length) {
                  childSnapshot.val().courses.forEach((asik) => {
                    // console.log(this.categoryData);
                    // console.log(asik);
                    // console.log(_.findIndex(this.categoryData[index].courses, {id:asik.id}));
                    var a = _.findIndex(this.categoryData[index].courses, { id: asik.id });
                    this.categoryData[index].courses[a].class = "active";
                    this.sendData[indexDat].courses[a].id = asik.id;
                    this.sendData[indexDat].courses[a].class = "active";
                    this.sendData[indexDat].courses[a].text = asik.text;
                  })
                }
                // console.log(this.categoryData);
                this.categoryData[index].price = dats.price;
                this.categoryData[index].status = dats.status;
                this.sendData[indexDat].price = dats.price;
                this.sendData[indexDat].status = dats.status;
                this.sendData[indexDat].productId = dats.productId;
              }
            })
          }
          this.categoryData[5].data = _.remove(this.categoryData, { parentId: '-KfQMIxSDCa1-T12Trze' });
          // console.log(this.categoryData);
          // console.log(this.umum);
          this.umum = _.remove(this.categoryData, { key: '-KfQMIxSDCa1-T12Trze' });
          this.sendData = _.union(this.categoryData, this.umum);
          // console.log(this.sendData);
          loader.dismiss();
        })
      })
    })
  }


  checkData() {
    for (let i = 0; i < this.data; i++) {
      if (this.categoryData.length > 0) {
        return
      };
    }
  }

  presentAlert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  getColor(a) {
    return String.fromCharCode(97 + a);
  }
  getBackColor(a, classic) {
    var d = String.fromCharCode(97 + a);
    if (classic != 'active') {
      return d = 'back' + d;
    } else {
      return d = 'back' + d + ' ' + 'active';
    }
  }
  formatCurrency(num) {
    return num
      .toFixed(2) // always two decimal digits
      .replace(".", ",") // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") // use . as a separator
  }
  currencyToNum(num) {
    console.log(num);
    var b = num.replace(".", "").replace(".", "").replace(".", "");
    return b;
  }
}
