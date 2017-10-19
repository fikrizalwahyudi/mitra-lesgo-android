import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ProfilePage } from '../profile/profile';
import { BlankPage } from '../blank/blank';
import { LoginPage } from '../login/login';
import { CardPage } from '../card/card';
import { FaqPage } from '../faq/faq';

/*
  Generated class for the Setting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
  providers: [UserService]
})
export class SettingPage {

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController
  ) { }
  openThis(name: string) {
    if (name == 'back') {
      this.navCtrl.pop();
    }
    else if (name == 'out') {
      let confirm = this.alertCtrl.create({
        title: 'Logout ?',
        message: 'Apakah Anda yakin ingin keluar ?',
        buttons: [
          {
            text: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'Logout',
            handler: () => {
              this.userService.logoutUser().then(() => {
                this.navCtrl.setRoot(LoginPage);
              });

            }
          }
        ]
      });
      confirm.present();
    }
    else if (name == 'edit') {
      this.navCtrl.push(ProfilePage);
    }
    else if (name == 'card') {
      this.navCtrl.push(CardPage);
    }
    else if (name == 'faq') {
      this.navCtrl.push(FaqPage);
    }
    else if (name == 'Terms & Condition' || name == 'Privacy') {
      console.log(name);
      this.navCtrl.push(BlankPage, { data1: name, data2: name });
    }
  }

}
