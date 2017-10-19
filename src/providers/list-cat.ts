import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
/*
  Generated class for the ListCat provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListCat {

  public fireAuth: any;
  public listCategories: any;
  public course: any;
  public categories: any;
  public umum: any;
  public products: any;
  public user: any;


  constructor(private http: Http) {
    this.fireAuth = firebase.auth();
    this.listCategories = firebase.database().ref('categories');
    this.course = firebase.database().ref('courses');
    this.user = firebase.database().ref('tutorProfile');
    this.umum = firebase.database().ref('categories').orderByChild('parentId').equalTo('-KfQMIxSDCa1-T12Trze');
    this.products = firebase.database().ref('products');
    this.categories = firebase.database().ref('categories');
  }

  getCategory() {
    return this.listCategories;
  }
  getCourses() {
    return this.course;
  }
  getProducts() {
    return this.products.orderByChild('parent').equalTo(false);
  }

  getUmums() {
    return this.products.orderByChild('parent').equalTo(true);
  }
  searchProducts() {
    return this.products;
  }
  getTeacherProducts(uid) {
    return this.products.orderByChild('userId').equalTo(uid);
  }
  getUmum() {
    return this.umum;
  }
  getCategoryName(uid) {
    return this.categories.child(uid);
  }
  checkClass() {
    var mydata = [], that = this;
    return this.products.orderByChild('users');
  }
  updateProduct(data, key, uid) {
    var that = this;
    this.user.child(uid).once('value', snapshot => {
      var follow = snapshot.val();
      console.log(follow);
      var course = [];
      for (let i = 0; i < data.courses.length; i++) {
        var sabi = data.courses[i];
        course.push({ id: sabi.id, text: sabi.text })
      }
      that.products.child(data.productId).set({
        about: follow.about, avatar: follow.avatar, categoryId: key, categoryName: data.name
        , courses: course, firstName: follow.firstName, gender: follow.gender, lastName: follow.lastName, latitude: follow.latitude,
        longitude: follow.longitude, price: data.price, status: false, byApp: true, updatedSchedule: false, userId: follow.uid
      });

    }, error => {
      alert('error on updating product');
    })
  }
  newProduct(data, key, uid) {
    var that = this;
    this.user.child(uid).once('value', function (snapshot) {
      var follow = snapshot.val();
      var course = [];
      for (let i = 0; i < data.courses.length; i++) {
        var sabi = data.courses[i];
        course.push({ id: sabi.id, text: sabi.text })
      }
      that.products.push({
        about: follow.about, avatar: follow.avatar, categoryId: key, categoryName: data.name
        , courses: course, firstName: follow.firstName, gender: follow.gender, lastName: follow.lastName, latitude: follow.latitude,
        longitude: follow.longitude, price: data.price, status: false, byApp: true, updatedSchedule: false, userId: follow.uid
      });
    }).then(follow => {
    }, error => {
      alert(error + 'error on storing');
    })
  }
}
