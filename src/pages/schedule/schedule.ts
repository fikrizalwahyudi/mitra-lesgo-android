import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { ListCat } from '../../providers/list-cat';
import { ModalSchedulePage } from '../modal-schedule/modal-schedule';
import * as _ from 'lodash';
import { Calendar } from '@ionic-native/calendar';
import * as moment from 'moment';

/*
  Generated class for the Schedule page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  providers: [UserService, ListCat]
})
export class SchedulePage {
  onOff: any = false;
  uid: any;
  inactiveDate: any;
  today: any = new Date();
  state: any = 'ON';
  schedule: any = { schedule: [{}, {}, {}, {}, {}, {}, {}, {}] };
  monday: any = false;
  tuesday: any = false;
  wednesday: any = false;
  thursday: any = false;
  friday: any = false;
  saturday: any = false;
  sunday: any = false;
  mondayData: any = [];
  tuesdayData: any = [];
  wednesdayData: any = [];
  thursdayData: any = [];
  fridayData: any = [];
  saturdayData: any = [];
  sundayData: any = [];
  stateVerification: any = [];
  loading: any;

  constructor(
    public Calendar: Calendar,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public params: NavParams,
    public modal: ModalController,
    public userService: UserService,
    public listCat: ListCat
  ) {
    console.log(this.params);
    if (this.params.get('stateVerification') != undefined) {
      this.stateVerification = this.params.get('stateVerification');
      this.uid = this.params.get('dataUser').uid;
    } else {
      this.stateVerification = 6;
      this.uid = this.params.get('uid');
    }
    if (this.stateVerification < 6) {
      this.onOff = true;
    }
    this.getSchedule(this.uid);
  }
  dateClick() {
    if (this.monday != false && this.mondayData == undefined) {
      this.monday = false;
    }
    else if (this.monday == false && this.mondayData != undefined) {
      this.monday = true;
    }
    else if (this.tuesday != false) {
      this.tuesday = false;
    }
    else if (this.tuesday == false && this.tuesdayData != undefined) {
      this.tuesday = true;
    }
    else if (this.wednesday != false) {
      this.wednesday = false;
    }
    else if (this.wednesday == false && this.wednesdayData != undefined) {
      this.wednesday = true;
    }
    else if (this.thursday != false) {
      this.thursday = false;
    }
    else if (this.thursday == false && this.thursdayData != undefined) {
      this.thursday = true;
    }
    else if (this.friday != false) {
      this.friday = false;
    }
    else if (this.friday == false && this.fridayData != undefined) {
      this.friday = true;
    }
    else if (this.saturday != false) {
      this.saturday = false;
    }
    else if (this.saturday == false && this.saturdayData != undefined) {
      this.saturday = true;
    }
    else if (this.sunday != false) {
      this.sunday = false;
    }
    else if (this.sunday == false && this.sundayData != undefined) {
      this.sunday = true;
    }
  }
  openModal(name) {
    var index = _.findIndex(this.schedule.schedule, { day: name });
    let scheduleModal = this.modal.create(ModalSchedulePage, { name: name, data: this.schedule.schedule[index] });
    scheduleModal.present();
    scheduleModal.onDidDismiss(data => {
      console.log(data);

      if (data != undefined) {
        if (data.day == 'Monday') {
          if (data.status == true) {
            this.schedule.schedule[1] = data;
            this.monday = true;
          }
          else {
            this.schedule.schedule[1] = data;
            this.schedule.schedule[1].status = false;
            this.monday = false;
          }
        }
        else if (data.day == 'Tuesday') {

          if (data.status == true) {
            this.schedule.schedule[2] = data;
            this.tuesday = true;
          }
          else {
            this.schedule.schedule[2] = data;
            this.schedule.schedule[2].status = false;
            this.tuesday = false;
          }
        }
        else if (data.day == 'Wednesday') {

          if (data.status == true) {
            this.schedule.schedule[3] = data;
            this.wednesday = true;
          }
          else {
            this.schedule.schedule[3] = data;
            this.schedule.schedule[3].status = false;
            this.wednesday = false;
          }
        }
        else if (data.day == 'Thursday') {

          if (data.status == true) {
            this.schedule.schedule[4] = data;
            this.schedule.schedule[4] = data;
            this.thursday = true;
          }
          else {
            this.schedule.schedule[4].status = false;
            this.thursday = false;
          }
        }
        else if (data.day == 'Friday') {
          console.log('masuk');
          if (data.status == true) {
            this.schedule.schedule[5] = data;
            this.schedule.schedule[5] = data;
            this.friday = true;
          }
          else {
            this.schedule.schedule[5].status = false;
            this.friday = false;
          }
        }
        else if (data.day == 'Saturday') {

          if (data.status == true) {
            this.schedule.schedule[6] = data;
            this.saturday = true;
          }
          else {
            this.schedule.schedule[6] = data;
            this.schedule.schedule[6].status = false;
            this.saturday = false;
          }
        }
        else if (data.day == 'Sunday') {

          if (data.status == true) {
            this.schedule.schedule[0] = data;
            this.sunday = true;
          }
          else {
            this.schedule.schedule[0] = data;
            this.schedule.schedule[0].status = false;
            this.sunday = false;
          }
        }

      }

    })
  }
  updateSchedule() {

    let loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    })
    loading.present();
    if (this.schedule.schedule == undefined) {
      this.presentAlert('tidak ada schedule yang terupdate, silahkan update terlebih dahulu');
      loading.dismiss();
      return;
    }
    var keys = []
    console.log(this.schedule);
    for (let i = 0; i < this.schedule.schedule.length; i++) {
      if (this.schedule.schedule[i] != undefined) {
        _.remove(this.schedule.schedule[i].status, (n) => {
          return n == false;
        });
      }
    }
    console.log(this.uid)
    this.userService.updateSchedule(this.uid, this.schedule.schedule).then((success) => {
      loading.dismiss();
      if (this.stateVerification < 3) {
        this.presentAlert('Jadwal telah tersimpan');
        this.userService.viewUser(this.uid).update({ stateVerification: 2 });
        this.navCtrl.pop();
      } else {
        this.userService.viewTutorProfile(this.uid).update({ onHoliday: !this.onOff, status: this.onOff }).then(() => {
          this.listCat.getTeacherProducts(this.uid).once('value', (snaps) => {
            snaps.forEach((child) => {
              console.log('snaps', child);
              let val = child.val();
              console.log('val', val)
              keys = child.key;
              if (!val.byApp) {
                this.listCat.searchProducts().child(keys).update({ status: this.onOff, updatedSchedule: true });
              }
            })
            this.presentAlert('Jadwal telah diubah');
            this.navCtrl.pop();
          })
        })
      }
    }, (error) => {
      alert('error : ' + error);
    });
  }
  getSchedule(uid) {
    let loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    })
    loading.present();
    this.userService.viewTutorProfile(uid).once('value', snapshot => {
      this.schedule = snapshot.val();
      if (!snapshot.val().schedule || snapshot.val().schedule.length == undefined || snapshot.val().schedule.length == 0) {
        this.schedule.schedule = [{}, {}, {}, {}, {}, {}, {}, {}]
      }

      console.log(this.schedule);
      var monday = _.findIndex(this.schedule.schedule, { day: 'Monday' });
      var tuesday = _.findIndex(this.schedule.schedule, { day: 'Tuesday' });
      var wednesday = _.findIndex(this.schedule.schedule, { day: 'Wednesday' });
      var thursday = _.findIndex(this.schedule.schedule, { day: 'Thursday' });
      var friday = _.findIndex(this.schedule.schedule, { day: 'Friday' });
      var saturday = _.findIndex(this.schedule.schedule, { day: 'Saturday' });
      var sunday = _.findIndex(this.schedule.schedule, { day: 'Sunday' });
      if (_.includes(this.schedule.schedule[sunday], true) == true) {
        this.schedule.schedule[0] = this.schedule.schedule[sunday];
        this.sunday = true;
      } if (_.includes(this.schedule.schedule[monday], true) == true) {
        this.schedule.schedule[1] = this.schedule.schedule[monday];
        this.monday = true;
      } if (_.includes(this.schedule.schedule[tuesday], true) == true) {
        this.schedule.schedule[2] = this.schedule.schedule[tuesday];
        this.tuesday = true;
      } if (_.includes(this.schedule.schedule[wednesday], true) == true) {
        this.schedule.schedule[3] = this.schedule.schedule[wednesday];
        this.wednesday = true;
      } if (_.includes(this.schedule.schedule[thursday], true) == true) {
        this.schedule.schedule[4] = this.schedule.schedule[thursday];
        this.thursday = true;
      } if (_.includes(this.schedule.schedule[friday], true) == true) {
        this.schedule.schedule[5] = this.schedule.schedule[friday];
        this.friday = true;
      } if (_.includes(this.schedule.schedule[saturday], true) == true) {
        this.schedule.schedule[6] = this.schedule.schedule[saturday];
        this.saturday = true;
      }
      if (this.stateVerification != undefined || this.stateVerification > 5) {
        this.onOff = typeof this.schedule.onHoliday == 'boolean' ? !this.schedule.onHoliday : this.schedule.status;
      }
      loading.dismiss();
      console.log(this.schedule);
    })
  }
  dismiss() {
    this.navCtrl.pop();
  }
  presentAlert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  openCalendar() {
    this.setCalendar(true)
  }




  getYear(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('YYYY'))
  }
  getMonth(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('MM'))
  }
  getDay(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('DD'))
  }

  setCalendar(openCalendar?) {
    this.Calendar.hasReadWritePermission().then((result) => {
      if (result === false) {
        this.Calendar.requestReadWritePermission().then((v) => {
          this.initDataCalendar(openCalendar);
        }, (r) => {
          console.log("Rejected");
        })
      } else {
        this.initDataCalendar(openCalendar)
      }
    })
  }
  initDataCalendar(openCalendar?) {
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    this.userService.getCartByTutor(this.uid).once('value', (res: any) => {
      let val = res.val();
      if (!val && openCalendar) {
        this.loading.dismissAll();
        return this.Calendar.openCalendar(new Date());
      }
      let allOrder = Object.keys(val).map((key) => { return val[key]; });
      return this.cekSchedule(allOrder, openCalendar);
    })
  }

  async cekSchedule(allOrder: any[], openCalendar?) {
    let list: any[] = [];
    for (let i = 0; i < allOrder.length; i++) {
      if (allOrder[i].status == 'booked') {
        console.log(allOrder[i].sessions)
        let matpel = allOrder[i].matpel.map((v: any) => { return v.text }).join(', ');
        let jenisPaket = allOrder[i].jenisPaket;
        let tutorName = allOrder[i].tutorName;
        let category = allOrder[i].categoryName;
        let namaMurid = allOrder[i].namaMurid;
        let alamat = allOrder[i].alamatMurid ? allOrder[i].alamatMurid : 'Rumah Murid';
        let schedule = allOrder[i].sessions.map((v: any, key: number) => {
          let newV = {
            title: `Lesgo sesi ke ${key + 1} ${matpel} untuk murid ${namaMurid}`,
            location: alamat,
            note: ` Sesi ke ${key + 1}, mata pelajaran ${matpel} untuk murid ${namaMurid}`,
            startDate: new Date(this.getYear(v.date), this.getMonth(v.date) - 1, this.getDay(v.date), parseInt(v.jam), 0, 0),
            endDate: new Date(this.getYear(v.date), this.getMonth(v.date) - 1, this.getDay(v.date), parseInt(v.jam) + 1, 30, 0),
          };
          return newV;
        })
        list = list.concat(schedule);
      }
    }
    let options = this.Calendar.getCalendarOptions();
    options.calendarName = "MitraLesgo";
    options.calendarId = 1;
    options.id = 'mitralesgo';
    options.firstReminderMinutes = 360;
    options.secondReminderMinutes = 60;
    let promises = [];
    for (let i = 0; i < list.length; i++) {
      await this.Calendar.findEventWithOptions(list[i].title, list[i].location, list[i].note, list[i].startDate, list[i].endDate, options).then((res: any) => {

        console.log('res', res)
        if (!res.length) {
          return this.setScheduleData(list[i], options)
        }
      })
    }
    this.loading.dismissAll();
    if (openCalendar) {
      await setTimeout(() => {
        this.Calendar.openCalendar(new Date());
      }, 100)
    }
  }

  async setScheduleData(list: any, options) {
    await this.Calendar.createEventWithOptions(list.title, list.location, list.note, list.startDate, list.endDate, options).then()
  }

}
