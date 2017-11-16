import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController, NavParams, ModalController, ActionSheetController, ToastController, Platform, Content, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Zapier } from '../../providers/zapier';
import { KelasPage } from '../kelas/kelas';
import { SettingPage } from '../setting/setting';
import { ReviewPage } from '../review/review';
import { BookingPage } from '../booking/booking';
import { SchedulePage } from '../schedule/schedule';
import { VerificationPage } from '../verification/verification';
import { CustomerservicePage } from '../customerservice/customerservice';
import * as firebase from 'firebase';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Calendar } from '@ionic-native/calendar';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { Network } from '@ionic-native/network';
import { ErrorPage } from '../error/error';
import { Helper } from '../../providers/Helper';
import { KonsultasiPage } from '../konsultasi/konsultasi';
import { OrderGuruPage } from '../order-guru/order-guru';
import * as moment from 'moment';

declare var cordova: any
declare var window;
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserService]
})
export class HomePage {
  @ViewChild(Content) content: Content;
  user: any = [];
  loading: Loading;
  today: any;
  myUserId: any;
  cartData: any = [];
  cartStatus: any;
  cartId: any;
  chatData: any = [];
  orderData: any = [];
  sessionData: number = 0;
  schedule: any = [];
  role: any;
  latLng: any = { lat: 0, lng: 0 };
  smsVerification: any;
  murid: any = [];
  status: any = false;
  smsVerificationCode: any;
  count: any = 0;
  subNotif: any;
  subForground: any;

  constructor(
    public network: Network,
    public zapier: Zapier,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public Camera: Camera,
    public Calendar: Calendar,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public plt: Platform,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public helper: Helper,
  ) {
    this.registerBackButton();
  }


  listenLoad() {
    let dataNotif = this.helper.getDataNotif();
    console.log('listen by up')
    if (dataNotif) {
      this.listenNotification(dataNotif)
    }
    if (this.subNotif) this.subNotif.unsubscribe();
    if (this.subForground) this.subForground.unsubscribe();
    this.subNotif = this.helper.emitterNotif.subscribe((res: any) => {
      console.log('listen by sub')
      this.listenNotification(res);
    });
    this.subForground = this.helper.emiterNotifFourground.subscribe((res: any) => {
      this.listenNotifFourground(res);
    })
  }
  // ionViewWillLeave() {
  //   console.log('leave')
  //   this.subNotif.unsubscribe();
  //   this.subForground.unsubscribe();
  // }

  listenNotifFourground(notification: any) {
    let toast = this.toastCtrl.create({
      message: notification.title,
      duration: 3500,
      position: 'top'
    });
    toast.present();
  }

  listenNotification(data: any) {
    console.log('dataNotif', data)
    console.log('this.navCtrl.getActive().component.name', this.navCtrl.getActive().component.name)
    // let toast = this.toastCtrl.create({
    //   message: data.title,
    //   duration: 3500,
    //   position: 'top'
    // });
    // toast.present();
    if (data.additionalData && (data.additionalData.typeNotif == 'order' || data.additionalData.typeNotif == 'sesi')) {
      let orderId = data.additionalData.orderId || data.additionalData.orderUId;
      console.log('orderId', orderId)
      return this.userService.getOrderData(orderId).once('value', snapshot => {
        console.log(snapshot)
        console.log(snapshot.val())
        let data = {
          order: snapshot.val(),
          status: 'booked'
        }
        if (this.navCtrl.getActive().component.name == 'OrderGuruPage') {
          this.helper.setDataOrderGuru(data);
          return undefined;
        }
        console.log('data notif', data)
        this.navCtrl.push(OrderGuruPage, data);
      })
    }
    if (data.additionalData && data.additionalData.typeNotif == 'review') {
      let data: any = {
        notification: true
      }
      if (this.navCtrl.getActive().component.name == 'ReviewPage') {
        this.helper.setDataReview(data);
        return undefined;
      }
      return this.userService.getUserDataOnce(firebase.auth().currentUser.uid).subscribe((res: any) => {
        var data = res.val();
        return this.navCtrl.push(ReviewPage, { uid: firebase.auth().currentUser.uid, dataUser: { firstName: data.firstName, lastName: data.lastName, avatar: data.avatar }, notification: true });
      })
    }
    if (data.additionalData && data.additionalData.typeNotif == 'chat') {

      this.myUserId = firebase.auth().currentUser.uid;
      console.log('this.myUserId', this.myUserId)
      this.userService.getUserDataOnce(this.myUserId).subscribe(snapshot => {
        console.log(snapshot.val());
        var dataUser = snapshot.val();
        this.helper.setUser(dataUser);
        if (data.additionalData.type == 'user') {
          let dataKonsultasi: any = {
            data: firebase.auth().currentUser.uid,
            muridUid: data.additionalData.uid,
          }
          if (this.navCtrl.getActive().component.name == 'KonsultasiPage') return undefined;
          this.navCtrl.push(KonsultasiPage, dataKonsultasi);
        }
        if (data.additionalData.type == 'cs') {
          if (this.navCtrl.getActive().component.name == 'CustomerservicePage') return undefined;
          this.navCtrl.push(CustomerservicePage, { data: firebase.auth().currentUser.uid, name: data.firstName, type: 'notification' });
        }
      })
    }
  }

  registerBackButton() {
    this.plt.registerBackButtonAction(() => {
      this.count = this.count + 1;
      if (this.count <= 1) {
        let toaster = this.toastCtrl.create({
          message: 'press back once more to exit the app',
          duration: 2000,
          position: 'bottom'
        });
        toaster.present();
      }
      if (this.count > 1) {
        this.plt.exitApp();
      }
      setTimeout(() => {
        if (this.count > 1) {
          this.plt.exitApp();
        }
      }, 2000)
    }, 1);
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter home');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      if (this.navCtrl.getActive().component.name != 'ErrorPage') {
        this.navCtrl.push(ErrorPage);
      }
    });
    this.network.onConnect().subscribe(() => {
      if (this.navCtrl.getActive().component.name == 'ErrorPage') {
        // this.navCtrl.pop();
      }
    })
    this.getUser();
    this.listenLoad();
  }
  getUser() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    setTimeout(() => {
      this.myUserId = firebase.auth().currentUser.uid;
      console.log('this.myUserId', this.myUserId)
      this.userService.getUserDataOnce(this.myUserId).subscribe(snapshot => {
        console.log('snapshot.val()', snapshot.val());
        var data = snapshot.val();
        this.user = data;
        this.user.userId = snapshot.key;
        this.helper.setUser(data);
        if (data.stateVerification < 4) {
          if (!data.smsVerificationStatus) {
            let smsobj = { uid: this.myUserId, phoneNumber: data.phoneNumber, email: data.email, verificationCode: data.smsVerificationCode, textMessage: "Ini adalah verification code dari LESGO!" };
            this.sendCode(smsobj);
            this.smsAlert(smsobj, data.phoneNumber, this.myUserId, data.smsVerificationCode, data);
          } else {
            this.tutorAlert(data);
          }
        } else if (data.stateVerification < 7) {
          let tutorAlert = this.alertCtrl.create({
            title: 'Selamat datang di Lesgo!',
            enableBackdropDismiss: false,
            message: 'Aplikasi anda telah disetujui. Lanjutkan proses administrasi Anda.',
            buttons: [
              {
                text: 'Next',
                handler: () => {
                  this.navCtrl.setRoot(VerificationPage, { dataUser: data });
                }
              }
            ]
          });
          console.log('this.user', this.user);
          tutorAlert.present();
        }
        else {
          this.chatNotificationCs();
          this.chatNotificationMurid();
          this.totalOrder();
          console.log('this.user', this.user)
          this.setCalendar();
          this.status = true;
        }
        loader.dismissAll();
      })
    }, 3000)
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
  getYear(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('YYYY'))
  }
  getMonth(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('MM'))
  }
  getDay(date) {
    return parseInt(moment(date, 'MM-DD-YYYY').format('DD'))
  }

  initDataCalendar(openCalendar?) {
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    this.userService.getCartByTutor(firebase.auth().currentUser.uid).once('value', (res: any) => {
      let val = res.val();
      if (!val) {
        this.loading.dismissAll();
        if (openCalendar) {
          return this.Calendar.openCalendar(new Date());
        }
        return undefined;
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
    console.log('before delete calendar');
    return this.Calendar.listCalendars().then((res: any) => {
      console.log('list calendar')
      console.log(res)
      if (res.map(v => { return v.name }).indexOf('MitraLesgo') != -1) {
        let hasOpen = false;
        this.Calendar.deleteCalendar('MitraLesgo').then((res: any) => {
          console.log('success delete calendar');
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        }, (err: any) => {
          console.log('err delete calendar');
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        })
        setTimeout(() => {
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        }, 5000)
      } else {
        return this.doSetCalendar(list, openCalendar);
      }
    })
  }

  doSetCalendar(list: any[], openCalendar?: boolean) {
    console.log('in doSetCalendar', list)
    let options = this.Calendar.getCalendarOptions();
    options.calendarName = "MitraLesgo";
    options.firstReminderMinutes = 360;
    options.secondReminderMinutes = 60;
    this.setScheduleData(list, options).then((res: any) => {
      console.log('set scheduleDate');
      this.loading.dismissAll();
      if (openCalendar) {
        setTimeout(() => {
          this.Calendar.openCalendar(new Date());
        }, 100)
      }
    }, (err: any) => {
      console.log('err setSCheduleData');
      this.loading.dismissAll();
      if (openCalendar) {
        setTimeout(() => {
          this.Calendar.openCalendar(new Date());
        }, 100)
      }
    })
  }

  async setScheduleData(list: any[], options) {
    for (let k in list) {
      await this.Calendar.createEventWithOptions(list[k].title, list[k].location, list[k].note, list[k].startDate, list[k].endDate, options)
    }
  }

  public uploadImage(data, fileType) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.user.userId);
    const filename = fileType;
    const imageRef = storageRef.child(`${filename}.png`);
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.user.avatar = snapshot.downloadURL;
      this.loading.dismissAll()
    }, err => {
      this.presentToast('Error while uploading file');
    });
  }

  chatNotificationMurid() {
    this.userService.getChatTutorStatus(this.myUserId).subscribe(snapshot => {
      console.log(snapshot);
      if (snapshot.length != 0) {
        this.chatData.murid = [];
        snapshot.forEach(o => {
          if (o.messages) {
            for (let k in o.messages) {
              console.log(o.messages[k].status)
              if (o.messages[k].status == false) {
                this.chatData.murid.push(o.messages[k]);
              }
            }
          }
        })
      }
    })
  }

  chatNotificationCs() {
    this.userService.getChatCsStatus(this.myUserId).subscribe(snapshot => {
      console.log(snapshot);
      if (snapshot.length != 0) {
        this.chatData.cs = [];
        snapshot.forEach(o => {
          if (o.status == false) {
            this.chatData.cs.push(o);
          }
        })
      }
    })
  }
  totalOrder() {
    this.userService.tutorCariMurid(this.myUserId).subscribe(snapshot => {
      this.orderData = [];
      this.sessionData = 0;
      if (snapshot.length != 0) {
        this.orderData = [];
        this.sessionData = 0;
        snapshot.forEach(a => {
          if (a.status == 'booked') {
            this.orderData.push(a);
            this.sessionData = this.sessionData + a.sessions.length;
          }
        })
      }
    })
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public takePicture(sourceType, fileType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      allowEdit: true,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: 0,
      encodingType: this.Camera.EncodingType.JPEG,
      mediaType: 0,
      correctOrientation: true
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.uploadImage(imagePath, fileType);
    }, (err) => {
      this.presentToast('Foto tidak terpilih');
    });
  }

  public presentActionSheet(fileType) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0, fileType);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1, fileType);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  navigateMe(name: string) {
    if (name == 'BookingPage') {
      this.navCtrl.push(BookingPage, { uid: this.myUserId });
    }
    else if (name == 'SchedulePage') {
      this.navCtrl.push(SchedulePage, { uid: this.myUserId });
    }
    else if (name == 'CustomerservicePage') {
      this.navCtrl.push(CustomerservicePage, { data: this.myUserId, name: this.user.firstName });
    }
    else if (name == 'Report') {
      this.navCtrl.push(ReviewPage, { uid: this.myUserId, dataUser: { firstName: this.user.firstName, lastName: this.user.lastName, avatar: this.user.avatar } });
    }
    else if (name == 'Class') {
      this.navCtrl.push(KelasPage, { dataUser: { uid: this.myUserId }, name: this.user.firstName });
    }
    else if (name == 'SettingPage') {
      this.navCtrl.push(SettingPage);
    }
  }
  sendEmail() {
    this.zapier.sendNotification({ message: 'Anda telah memesan guru Puja Altiar, yang akan mengajar pada 10 maret 2021 (ini test btw)', title: 'Anda mempunya order', to: 'de5aoAe80lk:APA91bG41x4yMQbbswn5YptnpZZWS58hUBHHRwqLpuwJkVsbQVMqA5wZVrQ_gA15LxbRhqObV7S9BLr3K6OCsgXAQPyIdppc2Sk6ilobJQ2mX4RUsHQDFCNK3wEJrwGY30MhdxCo-x_j' }).subscribe(success => {

    })
  }

  checckCode(code, uid) {
    this.zapier.checkSMS({ verificationCode: code, uid: uid }).subscribe(res => {
      if (res['_body'] == 'Wrong') {
        return false
      } else {
        return
      }
    })
  }
  updateUserStatus(uid) {
    this.userService.updateUserData(uid, { smsVerificationStatus: true }).then(() => {
      return true
    })
  }
  tutorAlert(data) {
    let tutorAlert = this.alertCtrl.create({
      title: 'Selamat datang di Lesgo!',
      enableBackdropDismiss: false,
      message: 'Anda belum terverifikasi sebagai Mitra Guru LESGO!. Silahkan melakukan verifikasi terlebih dahulu.',
      buttons: [
        {
          text: 'Lesgo!',
          handler: () => {
            this.navCtrl.setRoot(VerificationPage, { dataUser: data });
          }
        }
      ]
    });
    tutorAlert.present();
  }
  sendCode(smsObj) {
    // this.zapier.sendVerificationCode(smsObj).subscribe(res => {
    //   return

    // });
    this.zapier.sendverifivationCodeServer(smsObj).subscribe(res => {
      return

    });

  }
  smsAlert(smsObj, phoneNumber, uid, code, data) {
    let alert = this.alertCtrl.create({
      title: 'Verifikasi HP',
      message: 'Kode Verifikasi anda sedang dalam proses pengiriman ke ' + phoneNumber,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'code',
          placeholder: 'Kode Anda'
        }
      ],
      buttons: [
        {
          text: 'Resend Code',
          handler: datas => {
            this.resendSMS(smsObj);
            alert.setMessage('Pengiriman ulang ke nomor telah dilaksanakan ' + phoneNumber);
            return false
          }
        },
        {
          text: 'Confirm',
          handler: datas => {

            if (datas.code != code) {
              alert.setMessage('Kode verifikasi yang anda masukkan salah ');
              return false
            } else {
              this.updateUserStatus(uid);
              return this.tutorAlert(data);
            }
          }
        }
      ]
    });
    alert.present();
  }
  resendSMS(smsObj) {
    this.zapier.sendverifivationCodeServer(smsObj).subscribe(res => {
      console.log(res);
      if (res['_body'] == 'success') {
        return true
      } else {
        return false
      }
    });
  }

}
