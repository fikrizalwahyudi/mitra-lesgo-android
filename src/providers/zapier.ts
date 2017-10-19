import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Zapier provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Zapier {

  private accessToken: any;
  private orderUrl: any = [];
  public type: any;
  private from: any = { "dante": "ganteng" };
  private hari: string;
  private jamMulai: string;
  private jamSelesai: string;
  private kategori: string;
  private kelasKat: string;
  private lokasi: string;
  private muridName: string;
  private order: number;
  private sesi: number;
  private tanggalMulai: any;
  private tanggalSelesai: string;
  private to: string;
  private transactionId: number;
  private tutorName: string;
  private tutorTo: string;
  private zapierSmsUrl = 'https://hooks.zapier.com/hooks/catch/2149543/1rrhss/';
  private zapierEmailUrl = 'https://hooks.zapier.com/hooks/catch/2149543/1rrhss/';
  private zapierDirectEmailUrl = 'https://hooks.zapier.com/hooks/catch/2149543/179zml/';
  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  constructor(public http: Http) {

  }

  sendNotification(obj): Observable<Response[]> {
    // let body = {
    //   "data": {
    //     "title": obj.title,
    //     "message": obj.message,
    //     "typeNotif": obj.typeNotif
    //   },
    //   "to": obj.to
    // }
    let to = obj.to;
    delete obj.to;
    let body = {
      data: obj,
      to: to
    }
    console.log(body);
    let bodyString = JSON.stringify(body);
    console.log(bodyString);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'key=AIzaSyAvERBuauDhiYZ7PDxDZWGVxQcIF9rASKg'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.fcmUrl, bodyString, options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  sendNotificationOrder(obj): Observable<Response[]> {
    var that = this;
    let body = { data: { title: obj.title, message: obj.message, startDate: obj.startDate, endDate: obj.endDate }, to: obj.to };
    let bodyString = JSON.stringify(body);
    var fcmUrl = 'https://fcm.googleapis.com/fcm/send';
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'key=AIzaSyAvERBuauDhiYZ7PDxDZWGVxQcIF9rASKg' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option
    console.log(body);
    return that.http.post(that.fcmUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }
  checkSMS(obj): Observable<Response[]> {

    var body = { uid: obj.uid, email: obj.email, verificationCode: obj.verificationCode, textMessage: obj.textMessage };
    console.log(body);
    var body2 = 'uid=' + obj.uid + '&verificationCode=' + obj.verificationCode;
    console.log(body2);
    var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post('https://us-central1-web-uat-1a4d8.cloudfunctions.net/checkSms?' + body2, body2, options) // ...using post request
      .map((res: Response) => res) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); //...errors if any
  }
  sendVerificationCode(obj): Observable<Response[]> {


    var body2 = 'phoneNumber=' + obj.phoneNumber + '&verificationCode=' + obj.verificationCode;
    console.log(body2);
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post('https://us-central1-web-uat-1a4d8.cloudfunctions.net/sendSms?' + body2, body2, options) // ...using post request
      .map((res: Response) => res) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error || 'Server error')); //...errors if any

  }

  sendverifivationCodeServer(object) {
    console.log(object)
    var phone = object.phoneNumber;
    var code = object.verificationCode;
    var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    var options = new RequestOptions({ headers: headers });
    return this.http.get('http://les-go.com/api/twilio/' + phone + '/' + code, options)
      .map(response => response.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


  sendDirectEmail(obj): Observable<Response[]> {
    var that = this;
    var body = { userName: obj.userName, title: obj.title, to: obj.to, welcome: obj.welcome, message: obj.message, thanks: obj.thanks, thanksMessage: obj.thanksMessage };
    console.log(body);
    var body2 = 'userName=' + obj.userName + '&title=' + obj.title + '&to=' + obj.to + '&welcome=' + obj.welcome + '&message=' + obj.message + '&thanks=' + obj.thanks + '&thanksMessage=' + obj.thanksMessage + '&testMessage=Test';
    console.log(body2);
    var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/json', 'X-From-Service': 'Zapier' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return that.http.post(that.zapierDirectEmailUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error)); //...errors if any
  }
  sendEmail(obj): Observable<Response[]> {
    var that = this;
    var body = { from: obj.from, title: obj.title, to: obj.to, message: obj.message, sendTime: obj.sendTime };
    var body2 = 'from=' + obj.from + '&title=' + obj.title + '&to=' + obj.to + '&message=' + obj.sendTime + '&sendTime=' + obj.message + '&testMessage=Test';
    var bodyString = JSON.stringify(body);
    var headers = new Headers({ 'Content-Type': 'application/json', 'X-From-Service': 'Zapier' }); // ... Set content type to JSON
    var options = new RequestOptions({ headers: headers }); // Create a request option
    return that.http.post(that.zapierEmailUrl, bodyString, options) // ...using post request
      .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
  }

}
