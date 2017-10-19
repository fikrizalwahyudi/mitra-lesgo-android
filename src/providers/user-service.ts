import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { Zapier } from './zapier';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var cordova: any
declare var window;

@Injectable()
export class UserService {

  private data: any;
  private fireAuth: any;
  private userProfile: any;
  public userData: any;
  private muridProfile: any;
  private tutorProfile: any;
  private userTeacher: any;
  public listCategory: any;
  public usercart: any;
  public userCounter: number;
  public orderCounter: any;
  public userId: any;
  public serviceChats: any;
  public chats: any;
  public cartId: any;
  public cartData: any;
  public cart: any;
  public cartHistoryData: any;
  public chatId: any;
  public refferalId: any;
  public uploadRef: any;
  public bookingRef: any;
  public reviewRef: any;
  public tutorProfileRef: any;
  public productRef: any;
  newChats: FirebaseListObservable<any>;


  constructor(public http: Http, public Zapier: Zapier, public af: AngularFire) {
    this.fireAuth = firebase.auth();
    this.tutorProfileRef = firebase.database().ref('tutorProfile');
    this.bookingRef = firebase.database().ref('order');
    this.productRef = firebase.database().ref('products');
    this.uploadRef = firebase.storage().ref();
    this.userProfile = firebase.database().ref('users');
    this.muridProfile = firebase.database().ref('muridProfile');
    this.tutorProfile = firebase.database().ref('tutorProfile');
    this.cart = firebase.database().ref('order');
    this.reviewRef = firebase.database().ref('review');
    //CHANGE TO PROFILE TEACHER WHEN GOING LIVE
    this.userTeacher = firebase.database().ref('tutorProfile');
    this.serviceChats = firebase.database().ref('chat');
    this.getUserCounter();

    // this.userCartHis = firebase.database().ref('order').orderByChild('userId').equalTo(this.userId);
  }

  signUpGuru(email: string, password: string, firstName: string, lastName: string, telepon: string, role: string, gender: string) {
    var reffCode = '',
      reffType = '';
    var that = this;

    //address ganti jadi latlang ya cuy!
    //process signup
    return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUserCreated) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        var count = that.userCounter,
          reff = 1000 + count;
        that.af.database.object('/users/' + authenticatedUser.uid).set({
          id: count, avatar: 'https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d', createDate: firebase.database.ServerValue.TIMESTAMP, email: email, emailVerificationStatus: false, gender: gender, firstName: firstName, lastName: lastName, phoneNumber: telepon, refParent: '', refType: '', refCode: '', role: 'guru', smsVerificationCode: reff, smsVerificationStatus: false, stateVerification: 0, status: true, updateDate: firebase.database.ServerValue.TIMESTAMP
          , updateBy: authenticatedUser.uid
        });
        that.af.database.object('/tutorProfile/' + authenticatedUser.uid).set({
          displayAddress: '', rekening: '', bank: '', cabang: '', avatar: 'https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d', createDate: firebase.database.ServerValue.TIMESTAMP, email: email, gender: gender, firstName: firstName, fullName: firstName + ' ' + lastName, lastName: lastName, refParent: '', refType: '', refCode: '', role: 'guru', status: true
          , updateBy: authenticatedUser.uid, schedule: '', about: '', address: '', cityId: '', cityName: '', updateDate: firebase.database.ServerValue.TIMESTAMP, latitude: '', longitude: '', pekerjaan: '', phoneNumber: telepon, postalCode: '', provinceId: '', provinceName: '', published: false, tingkatPendidikanTerakhir: '', uid: authenticatedUser.uid, universitas: '',
          perguruanTinggi: ''
        });
      })

    })
  }
  loginUser(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password).then((currentUser) => {
      this.userProfile.child(currentUser.uid + '/role').once('value').then((role) => {
        if (role.val() == 'guru') {
          return;
        } else {
          alert('Maaf applikasi ini hanya untuk mitra kami');
          return this.fireAuth.signOut();
        }
      })
    });
  }
  logoutUser() {
    return this.fireAuth.signOut();
  }
  forgotUser(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
  viewUser(userId: any) {
    var userRef = this.userProfile.child(userId);
    return userRef;
  }
  viewTeacher(userId: any) {
    var viewTeach = this.userTeacher.child(userId);
    return viewTeach;
  }
  userCartHistory() {
    return firebase.database().ref('order');
    //  ,function(snapshot){
    //  var data = snapshot.val();
    //  return data
    // });
  }
  userCart() {
    return firebase.database().ref('cart');
    // var data = snapshot.val();
    // return data

  }
  getOrderCounter() {
    return firebase.database().ref('order').on('value', (snapshot) => {
      this.orderCounter = snapshot.numChildren();
    });
    //   .then(function(snapshot){
    //     var data = snapshot.numChildren();
    // }, function(error){
    //   console.log(error);
    // })
  }

  getOrderData(orderUid: string) {
    return firebase.database().ref('order/' + orderUid)
  }
  getUserCounter() {
    firebase.database().ref('users').once('value', (snapshot) => {
      this.userCounter = snapshot.numChildren();
    });
    //  .then(function(snapshot){
    //   var data = snapshot.numChildren();
    //   return data;
    //   }, function(error){
    //     console.log(error);
    //   })
  }

  userID() {
    return this.userId;
  }
  askChats(id) {
    var service = firebase.database().ref('chat/' + id);
    return service.orderByChild('userId').equalTo('cs');
  }
  tutorChats() {
    return this.serviceChats;
  }
  myChatsGuru(myUid: any, tutorUid: any) {
    var readChats = firebase.database().ref('chat/' + myUid).orderByChild('userId').equalTo(tutorUid);
    return readChats;
  };
  sendChatsCS(message: any, senderUid: any, senderName: any) {
    return firebase.database().ref('chat/' + senderUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: 'cs', receiverName: 'LESGO!', sender: senderUid, senderName: senderName, userId: 'cs', position: 'right' });
  };
  sendChatsTutor(message: any, receiverUid, senderName, senderUid, receiverName) {
    return firebase.database().ref('chat/' + senderUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: receiverUid, position: 'right' }).then(() => {
      firebase.database().ref('chat/' + receiverUid).push({ message: message, type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: senderUid, receiverName: senderName, sender: receiverUid, senderName: receiverName, userId: senderUid, position: 'left' })
    });

  };
  myChatsCS(userId: any) {
    var readChats = firebase.database().ref('chat/' + userId).orderByChild('userId').equalTo('cs');
    return readChats;
  }
  getChatsGuru(uid) {
    firebase.database().ref('/chat').orderByChild('userId').equalTo(uid).on('value', function (snapshot) {
      var data = Object.keys(snapshot.val());
      console.log(data);
      console.log(snapshot.val());
      firebase.database().ref('profileGuru').child(uid).update({ chat: data[0] })
    });
  };
  catchCartData() {
    return this.cartData;
  };
  getCart(uid) {
    return this.cart.orderByChild('uid').equalTo(uid);
  }
  getCartByTutor(uid) {
    return this.cart.orderByChild('tutorUid').equalTo(uid);
  }
  catchCartHistoryData() {
    return this.cartHistoryData;
  };
  sendImage(url: any, senderUid: any, senderName: any) {
    return firebase.database().ref('chat/' + senderUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: 'cs', receiverName: 'LESGO!', sender: senderUid, senderName: senderName, userId: 'cs', position: 'right' });
  };
  sendImageTutor(url: any, senderUid: any, senderName: any, receiverUid, receiverName) {
    return firebase.database().ref('chat/' + senderUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: receiverUid, position: 'right' }).then(() => {
      firebase.database().ref('chat/' + receiverUid).push({ message: url, type: 'img', sentAt: firebase.database.ServerValue.TIMESTAMP, receiver: receiverUid, receiverName: receiverName, sender: senderUid, senderName: senderName, userId: senderUid, position: 'left' })
    });
  }
  saveMurid(data) {
    data.forEach(function (child) {
      if (child.status == 'new') {
        firebase.database().ref('muridProfile/')
          .push({
            avatar: child.avatar, firstName: child.firstName, lastName: child.lastName, gender: child.gender, alamat: child.address, province: child.province, city: child.city, posCode: child.posCode, latitude: child.latitude, longitude: child.longitude, dob: child.dob, userId: child.userId,
            createdAt: firebase.database.ServerValue.TIMESTAMP, updatedAt: firebase.database.ServerValue.TIMESTAMP, displayAddress: child.displayAddress
          })
      }
      else if (child.status == 'update') {
        firebase.database().ref('muridProfile/' + child.key).update({
          avatar: child.avatar, firstName: child.firstName, lastName: child.lastName, gender: child.gender, alamat: child.address, province: child.province, city: child.city, posCode: child.posCode, latitude: child.latitude, longitude: child.longitude, dob: child.dob, userId: child.userId,
          updatedAt: firebase.database.ServerValue.TIMESTAMP, displayAddress: child.displayAddress
        })
      }
    })
  }
  loadMurid(userId) {
    return this.muridProfile.orderByChild('userId').equalTo(userId);
  }
  viewMurid(userId) {
    return this.muridProfile.child('userId');
  }
  updateProfilePicture(picture: any = null): any {
    var userId = this.fireAuth.currentUser.uid;
    return this.uploadRef.child(userId)
      .putString(picture, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.userProfile.child(userId).update({

          avatar: savedPicture.downloadURL
        });
      })
  }
  uploadReview(orderId, review, types) {
    if (types == 'murid') {
      firebase.database().ref('order/' + orderId).update({ review: review })
    }
    else {
      firebase.database().ref('order/' + orderId + '/sessions').update({ absensi: review })
    }
  }
  addProfileUser(photoUrl: any) {
    this.userProfile.update({ avatar: photoUrl });
  }
  addProfileMurid(photoUrl: any) {
    this.muridProfile.update({ avatar: photoUrl });
  }
  addProfileTutor(photoUrl: any) {
    this.tutorProfile.update({ avatar: photoUrl });
  }

  updateSchedule(uid, data) {
    var a = this.tutorProfileRef.child(uid + '/schedule').set(data);
    return a;
  }
  updateTutorProfile(uid, data) {
    return this.af.database.object('/tutorProfile/' + uid).update(data);
  }
  setCv(uid, work, edukasi) {
    var a: any = {};
    a.edukasi = edukasi;
    a.work = work;
    console.log('uid', uid);
    return this.af.database.object('/cv/' + uid).set(a);
  }
  updateCv(uid, work, edukasi) {
    var a: any = {};
    a.edukasi = edukasi;
    a.work = work;
    console.log('uid', uid);
    return this.af.database.object('/cv/' + uid).update(a);
  }
  viewTutorProfile(uid) {
    var a = this.tutorProfileRef.child(uid);
    return a;
  }

  createProduct(uid, data) {
    var b = this.productRef.push(data);
    return b;
  }

  updateProduct(uid, product, data) {
    var b = this.productRef.child(product).update(data);
    return b;
  }
  myProduct(uid) {
    var b = this.productRef.orderByChild('userId').equalTo(uid);
    return b;
  }
  getUser(uid): Promise<any> {
    return new Promise(resolve => {
      this.userProfile.child(uid).once('value').then(data => {
        resolve(data);
      })
    });
  }
  getReview(uid) {
    var c = this.reviewRef.orderByChild('receiverId').equalTo(uid);
    return c;
  }
  submitReview(uid, data) {
    this.reviewRef.push({ senderId: data.senderId, senderName: data.senderName, review: data.review, createDate: firebase.database.ServerValue.TIMESTAMP, rating: data.rate, receiverId: data.receiverId, receiverName: data.receiverName })
  }


  getTotalOrder(uid) {
    var d;
    this.getBooking(uid).once('value', function (snapshot) {
      d = snapshot.numChildren();
    })
    return d;
  }
  updateSession(uid, data) {
    var e;
    e = this.bookingRef.child(uid).update(data);
    return e;
  }
  //NEW DATABASE
  newChatCs(userId) {
    return this.af.database.list('/chat/' + userId + '/messages');
  }
  sendFirstChat(userId, name) {
    this.af.database.object('/chat/' + userId).set({ uid1: userId, uid2: 'cs', messages: '', uid2Name: 'LESGO!', uid1Name: name });
    return this.af.database.list('/chat/' + userId + '/messages').push({ message: 'Welcome to LESGO!', type: 'text', sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'left' })
  }
  sendChatCsNew(message, userId, name, type) {
    return this.af.database.list('/chat/' + userId + '/messages/').push({ message: message, type: type, sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'right' });
  }
  updateChatStatus(key, userId) {
    return this.af.database.object('/chat/' + userId + '/messages/' + key).update({ status: true });
  }
  tutorCariMurid(tutorId) {
    return this.af.database.list('/order/', {
      query: {
        orderByChild: 'tutorUid',
        equalTo: tutorId
      }
    })
  }
  newChatTutor(userId, tutorId) {
    return this.af.database.list('/konsultasi/' + userId + tutorId + '/messages');
  }
  sendChatTutorNew(message, userId, tutorId, type) {
    return this.af.database.list('/konsultasi/' + userId + tutorId + '/messages/').push({ message: message, type: type, sentAt: firebase.database.ServerValue.TIMESTAMP, status: false, position: 'left' });
  }
  updateChatStatusTutor(userId, tutorId, key) {
    return this.af.database.object('/konsultasi/' + userId + tutorId + '/messages/' + key).update({ status: true });
  }
  firstChatTutor(userId, tutorId) {
    return this.af.database.object('/konsultasi/' + userId + tutorId).update({ uid1: userId, uid2: tutorId })
  }
  getChatTutorStatus(tutorId) {
    return this.af.database.list('/konsultasi/', {
      query: {
        orderByChild: 'uid2',
        equalTo: tutorId
      }
    })
  }
  getKonsultasiStatus(userId, tutorId) {
    return this.af.database.list('/konsultasi/' + userId + tutorId + '/messages')
  }
  getChatCsStatus(tutorId) {
    return this.af.database.list('/chat/' + tutorId + '/messages');
  }
  getUserDataOnce(userId) {
    return this.af.database.object('/users/' + userId, { preserveSnapshot: true }).take(1);
  }
  getUserData(userId) {
    return this.af.database.object('/users/' + userId);
  }
  updateUserData(userId, data) {
    return this.af.database.object('/users/' + userId).update(data);
  }
  getTutorReview(userId) {
    return this.af.database.list('/review/' + userId);
  }
  updateOrdertatus(orderId, data) {
    return this.af.database.object('/order/' + orderId).update(data);
  }
  updateSessionTime(orderId, sessionIndex, data) {
    return this.af.database.object('/order/' + orderId + '/sessions/' + sessionIndex).update(data);
  }
  getBooking(uid) {
    var c = this.bookingRef.orderByChild('tutorUid').equalTo(uid);
    return c;
  }
  updateTutorUser(uid, data) {
    return this.af.database.object('users/' + uid).update(data);
  }
  getCV(uid) {
    return this.af.database.object('cv/' + uid, { preserveSnapshot: true }).take(1);
  }
  //  addFile(pdfblob, uid, filename,mimetype, extension):any{
  //
  //
  //   return  firebase.storage().ref(uid).child(filename+extension)
  //            .put(pdfblob,{contentType: mimetype});
  //      }
}
