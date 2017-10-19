import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { VerificationPage } from '../pages/verification/verification';
import { CustomerservicePage } from '../pages/customerservice/customerservice';
import { SettingPage } from '../pages/setting/setting';
import { KonsultasiPage } from '../pages/konsultasi/konsultasi';
import { BlankPage } from '../pages/blank/blank';
import { MapsPage } from '../pages/maps/maps';
import { AbsensiPage } from '../pages/absensi/absensi';
import { BookingPage } from '../pages/booking/booking';
import { DetailPage } from '../pages/detail/detail';
import { KelasPage } from '../pages/kelas/kelas';
import { ReviewPage } from '../pages/review/review';
import { SchedulePage } from '../pages/schedule/schedule';
import { SessionsPage } from '../pages/sessions/sessions';
import { ModalSchedulePage } from '../pages/modal-schedule/modal-schedule';
import { LetterPage } from '../pages/letter/letter';
import { FaqPage } from '../pages/faq/faq';
import { CardPage } from '../pages/card/card';
import { InterviewPage } from '../pages/interview/interview';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { OrderGuruPage } from '../pages/order-guru/order-guru';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Zapier } from '../providers/zapier';
import { UserService } from '../providers/user-service';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { HttpModule } from '@angular/http';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Calendar } from '@ionic-native/calendar';
import { AngularFireModule } from 'angularfire2';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Network } from '@ionic-native/network';
import { ErrorPage } from '../pages/error/error';
import { CvPage } from '../pages/cv/cv';
import { Helper } from '../providers/Helper';



const confis = {
  apiKey: "AIzaSyBFKhA17tr8f2ki0agybmDZ2Pk_iYu2YLg",
  authDomain: "web-uat-1a4d8.firebaseapp.com",
  databaseURL: "https://web-uat-1a4d8.firebaseio.com",
  storageBucket: "web-uat-1a4d8.appspot.com",
  messagingSenderId: "732818088048"
};


@NgModule({
  declarations: [
    MyApp,
    CvPage,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProfilePage,
    KonsultasiPage,
    SettingPage,
    CustomerservicePage,
    BlankPage,
    MapsPage,
    DetailPage,
    OrderDetailPage,
    AbsensiPage,
    BookingPage,
    DetailPage,
    KelasPage,
    ReviewPage,
    SchedulePage,
    ModalSchedulePage,
    VerificationPage,
    LetterPage,
    CardPage,
    InterviewPage,
    SessionsPage,
    OrderGuruPage,
    FaqPage,
    ErrorPage
  ],
  imports: [
    HttpModule,
    TextMaskModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    AngularFireModule.initializeApp(confis),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCsCcTL_NLswlKyQ0mweNB-DLY3tHVn9P4',
      libraries: ['places']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CvPage,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProfilePage,
    KonsultasiPage,
    SettingPage,
    CustomerservicePage,
    BlankPage,
    MapsPage,
    DetailPage,
    OrderDetailPage,
    AbsensiPage,
    BookingPage,
    DetailPage,
    KelasPage,
    ReviewPage,
    SchedulePage,
    ModalSchedulePage,
    VerificationPage,
    LetterPage,
    CardPage,
    InterviewPage,
    SessionsPage,
    OrderGuruPage,
    FaqPage,
    ErrorPage
  ],
  providers: [
    LocalNotifications,
    Push,
    Calendar,
    FileChooser,
    FileOpener,
    FilePath,
    Transfer,
    File,
    Camera,
    Zapier,
    UserService,
    Network,
    Helper
  ]
})
export class AppModule { }
