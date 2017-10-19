import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ActionSheetController, NavParams, ModalController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { LoginPage } from '../login/login';
import { MapsPage } from '../maps/maps';
import * as firebase from 'firebase';
import { CvPage } from '../cv/cv';
// import { ImagePicker,Camera, File, Transfer, FilePath, FileChooser} from 'ionic-native';
// , File, Transfer, FilePath, FileChooser
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { TextMaskModule } from 'angular2-text-mask';


declare var cordova: any
declare var window;
// import { GalleryPage } from '../gallery/gallery';
import { Observable } from 'rxjs/Rx';
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [UserService]
})
export class ProfilePage {
  @ViewChild(Content) content: Content;
  userGenderState: any = false;
  userAvatar: any;
  userLatLong: any = { lat: 0, long: 0 };
  lastImage: string = null;
  loading: Loading;
  captureDataUrl: any;
  listMurid: any = [];
  numsky: any;
  select: any;
  email: any;
  jumlahMurid: any = 0;
  dataMurid: any = [];
  dataTutor: any = [];
  dataUser: any = { avatar: "assets/Male.png", firstName: "", lastName: "", gender: "", alamat: "", provinceId: "", provinceName: "", cityId: "", cityName: "", posCode: "", latitude: "", longitude: "", dob: "", uid: "", updatedAt: "", displayAddress: "" };
  province: any = [
    {
      id: 0,
      name: 'DKI Jakarta'
    },
    {
      id: 1,
      name: 'Bali'
    },
    {
      id: 2,
      name: 'Banten'
    },
    {
      id: 3,
      name: 'Bengkulu'
    },
    {
      id: 4,
      name: 'D.I Yogyakarta'
    },
    {
      id: 5,
      name: 'Gorontalo'
    },
    {
      id: 6,
      name: 'Jambi'
    },
    {
      id: 7,
      name: 'Jawa Barat'
    },
    {
      id: 8,
      name: 'Jawa Tengah'
    },
    {
      id: 9,
      name: 'Jawa Timur'
    },
    {
      id: 10,
      name: 'Kalimantan Selatan'
    },
    {
      id: 11,
      name: 'Kalimantan Tengah'
    },
    {
      id: 12,
      name: 'Kalimantan Timur'
    },
    {
      id: 13,
      name: 'Kalimatan Barat'
    },
    {
      id: 14,
      name: 'Bangka Belitung'
    },
    {
      id: 15,
      name: 'Kepulauan Riau'
    },
    {
      id: 16,
      name: 'Lampung'
    },
    {
      id: 17,
      name: 'Maluku'
    },
    {
      id: 18,
      name: 'Maluku Utara'
    },
    {
      id: 19,
      name: 'Nanggroe Aceh Darussalam'
    },
    {
      id: 20,
      name: 'Nusa Tenggara Barat'
    },
    {
      id: 21,
      name: 'Nusa Tenggara Timur'
    },
    {
      id: 22,
      name: 'Papua'
    },
    {
      id: 23,
      name: 'Papua Barat'
    },
    {
      id: 24,
      name: 'Riau'
    },
    {
      id: 25,
      name: 'Sulawesi Barat'
    },
    {
      id: 26,
      name: 'Sulawesi Selatan'
    },
    {
      id: 27,
      name: 'Sulawesi Tengah'
    },
    {
      id: 28,
      name: 'Sulawesi Tenggara'
    },
    {
      id: 29,
      name: 'Sulawesi Utara'
    },
    {
      id: 30,
      name: 'Sumatera Barat'
    },
    {
      id: 31,
      name: 'Sumatera Selatan'
    },
    {
      id: 32,
      name: 'Sumatera Utara'
    }
  ];

  city: any = [
    {
      id: 0,
      name: ['Jakarta Barat',
        'Jakarta Timur',
        'Jakarta Selatan',
        'Jakarta Pusat',
        'Jakarta Utara',
        'Kep Seribu'],
      provinceId: 0
    },
    {
      id: 1,
      name: ['Badung',
        'Bangli',
        'Buleleng',
        'Denpasar',
        'Gianyar',
        'Jembrana',
        'Karangasem',
        'Klungkung',
        'Tabanan'],
      provinceId: 1
    },
    {
      id: 2,
      name: ['Cilegon',
        'Kabupaten Serang',
        'Kabupaten Tangerang',
        'Lebak',
        'Pandeglang',
        'Serang',
        'Tangerang',
        'Tangerang Selatan'],
      provinceId: 2
    },
    {
      id: 3,
      name: ['Bengkulu',
        'Bengkulu Selatan',
        'Bengkulu Tengah',
        'Bengkulu Utara',
        'Kaur',
        'Kepahiang',
        'Lebong',
        'Muko Muko',
        'Rejang Lebong',
        'Seluma'],
      provinceId: 3
    },
    {
      id: 4,
      name: ['Bantul',
        'Gunung Kidul',
        'Kulon Progo',
        'Sleman',
        'Yogyakarta'],
      provinceId: 4
    },
    {
      id: 5,
      name: ['Boalemo',
        'Bone Bolango',
        'Gorontalo',
        'Gorontalo Utara',
        'Kabupaten Gorontalo',
        'Pahuwato'],
      provinceId: 5
    },
    {
      id: 6,
      name: ['Batang Hari',
        'Bungo',
        'Jambi',
        'Kerinci',
        'Merangin',
        'Muaro Jambi',
        'Sorolangun',
        'Sungai Penuh',
        'Tanjung Jabung Barat',
        'Tanjung Jabung Timur',
        'Tebo'],
      provinceId: 6
    },
    {
      id: 7,
      name: ['Bandung',
        'Bandung Barat',
        'Banjar',
        'Bekasi',
        'Bogor',
        'Ciamis',
        'Cianjur',
        'Cimahi',
        'Depok',
        'Garut',
        'Indramayu',
        'Kabupaten Bandung',
        'Kabupaten Bekasi',
        'Kabupaten Bogor',
        'Kabupaten Cirebon',
        'Kabupaten Sukabumi',
        'Kabupaten Tasikmalaya',
        'Karawang',
        'Kota Cirebon',
        'Kota Sukabumi',
        'Kota Tasikmalaya',
        'Kuningan',
        'Purwakarta',
        'Subang',
        'Sumedang'],
      provinceId: 7
    },
    {
      id: 8,
      name: ['Banjarnegara',
        'Banyumas',
        'Batang',
        'Blora',
        'Boyolali',
        'Brebes',
        'Cilacap',
        'Demak',
        'Grobogan',
        'Kabupaten Pekalongan',
        'Kabupaten Semarang',
        'Kabupaten Tegal',
        'Karanganyar',
        'Kebumen',
        'Kendal',
        'Klaten',
        'Kota Pekalongan',
        'Kota Tegal',
        'Kudus',
        'Magelang',
        'Pati',
        'Pemalang',
        'Purbalingga',
        'Purworejo',
        'Rembang',
        'Salatiga',
        'Semarang',
        'Sragen',
        'Sukoharjo',
        'Surakarta',
        'Temanggung',
        'Wonogiri',
        'Wonosobo'],
      provinceId: 8
    },
    {
      id: 9,
      name: ['Bangkalan',
        'Banyuwangi',
        'Batu',
        'Bojonegoro',
        'Bondowoso',
        'Gresik',
        'Jember',
        'Jombang',
        'Kabupaten Blitar',
        'Kabupaten Kediri',
        'Kabupaten Madiun',
        'Kabupaten Malang',
        'Kabupaten Mojokerto',
        'Kabupaten Pasuruan',
        'Kabupaten Probolinggo',
        'Kota Blitar',
        'Kota Kediri',
        'Kota Madiun',
        'Kota Malang',
        'Kota Mojokerto',
        'Kota Pasuruan',
        'Kota Probolinggo',
        'Lamongan',
        'Lumajang',
        'Magetan',
        'Nganjuk',
        'Ngawi',
        'Pacitan',
        'Pamekasan',
        'Ponorogo',
        'Sampang',
        'Sidoarjo',
        'Situbondo',
        'Sumenep',
        'Surabaya',
        'Trenggalek',
        'Tuban',
        'Tulungagung'],
      provinceId: 9
    },
    {
      id: 10,
      name: ['Balangan',
        'Banjar',
        'Banjarbaru',
        'Banjarmasin',
        'Barito Kuala',
        'Hulu Sungai Selatan',
        'Hulu Sungai Tengah',
        'Hulu Sungai Utara',
        'Kotabaru',
        'Tanah Bumbu',
        'Tanah Laut',
        'Tapin'],
      provinceId: 10
    },
    {
      id: 11,
      name: ['Barito Timur',
        'Barito Selatan',
        'Barito Utara',
        'Gunung Mas',
        'Kapuas',
        'Katingan',
        'Kotawaringin Barat',
        'Kotawaringin Timur',
        'Murung Raya',
        'Palangka Raya',
        'Pulau Pisau',
        'Seruyan',
        'Sukamara'],
      provinceId: 11
    },
    {
      id: 12,
      name: ['Balikpapan',
        'Berau',
        'Bontang',
        'Bulungan',
        'Kutai Barat',
        'Kutai Kertanegara',
        'Kutai Timur',
        'Malinau',
        'Nunukan',
        'Paser',
        'Penajam Paser Utara',
        'Samarinda',
        'Tana Tidung',
        'Tarakan'],
      provinceId: 12
    },
    {
      id: 13,
      name: ['Bengkayang',
        'Kabupaten Pontianak',
        'Kapuas Hulu',
        'Kayong Utara',
        'Ketapang',
        'Kubu Raya',
        'Landak',
        'Melawai',
        'Pontianak',
        'Sambas',
        'Sanggau',
        'Sekadau',
        'Singkawang',
        'Sintang'],
      provinceId: 13
    },
    {
      id: 14,
      name: ['Bangka',
        'Bangka Barat',
        'Bangka Selatan',
        'Bangka Tengah',
        'Belitung',
        'Belitung Timur',
        'Pangkal Pinang'],
      provinceId: 14
    },
    {
      id: 15,
      name: ['Batam',
        'Bintan',
        'Karimun',
        'Kepulauan Anambas',
        'Lingga',
        'Natuna',
        'Tanjung Pinang'],
      provinceId: 15
    },
    {
      id: 16,
      name: ['Bandar Lampung',
        'Lampung Barat',
        'Lampung Selatan',
        'Lampung Tengah',
        'Lampung Timur',
        'Lampung Utara',
        'Mesuji',
        'Metro',
        'Pesawaran',
        'Pringsewu',
        'Tanggamus',
        'Tulang Bawang',
        'Tulang Bawang Barat',
        'Way Kanan'],
      provinceId: 16
    },
    {
      id: 17,
      name: ['Ambon',
        'Buru',
        'Buru Selatan',
        'Kepulauan Aru',
        'Maluku Barat Daya',
        'Maluku Tengah',
        'Maluku Tenggara',
        'Maluku Tenggara Barat',
        'Seram Bagian Barat',
        'Seram Bagian Timur',
        'Tual'],
      provinceId: 17
    },
    {
      id: 18,
      name: ['Halmahera Barat',
        'Halmahera Selatan',
        'Halmahera Tengah',
        'Halmahera Timur',
        'Halmahera Utara',
        'Kepulauan Morotai',
        'Kepulauan Sula',
        'Sofifi',
        'Ternate',
        'Tidore Kepulauan'],
      provinceId: 18
    },
    {
      id: 19,
      name: ['Aceh Barat',
        'Aceh Barat Daya',
        'Aceh Besar',
        'Aceh Jaya',
        'Aceh Selatan',
        'Aceh Singkil',
        'Aceh Tamiang',
        'Aceh Tengah',
        'Aceh Tenggara',
        'Aceh Timur',
        'Aceh Utara',
        'Banda Aceh',
        'Bener Meriah',
        'Bireuen',
        'Gayo Lues',
        'Langsa',
        'Lhokseumawe',
        'Nagan Raya',
        'Pidie',
        'Pidie JayaSabang',
        'Sabang',
        'Simeulue',
        'Subulussalam'],
      provinceId: 19
    },
    {
      id: 20,
      name: ['Dompu',
        'Kabupaten Bima',
        'Kota Bima',
        'Lombok Barat',
        'Lombok Tengah',
        'Lombok Timur',
        'Lombok Utara',
        'Mataram',
        'Sumbawa',
        'Sumbawa Barat'],
      provinceId: 20
    },
    {
      id: 21,
      name: ['Alor',
        'Belu',
        'Ende',
        'Flores Timur',
        'Kabupaten Kupang',
        'Kupang',
        'Lembata',
        'Manggarai',
        'Manggarai Barat',
        'Manggarai Timur',
        'Nagekeo',
        'Ngada',
        'Rote Ndao',
        'Sabu Raijua',
        'Sikka',
        'Sumba Barat',
        'Sumba Barat Daya',
        'Sumba Tengah',
        'Sumba Timur',
        'Timor Tengah Selatan',
        'Timor Tengah Utara'],
      provinceId: 21
    },
    {
      id: 22,
      name: ['Asmat',
        'Biak Numfor',
        'Boven Digoel',
        'Deiyai',
        'Dogiyai',
        'Intan Jaya',
        'Jayapura',
        'Jayawijaya',
        'Kabupaten Jayapura',
        'Keerom',
        'Lanny Jaya',
        'Mamberamo Raya',
        'Mappi',
        'Membramo Tengah',
        'Merauke',
        'Mimika',
        'Nabire',
        'Nduga',
        'Paniai',
        'Pegunungan Bintang',
        'Puncak',
        'Puncak Jaya',
        'Sarmi',
        'Supiori',
        'Tolikara',
        'Yahukimo',
        'Yalimo',
        'Yapen Waropen'],
      provinceId: 22
    },
    {
      id: 23,
      name: ['Fakfak',
        'Kabupaten Sorong',
        'Kaimana',
        'Kota Sorong',
        'Manokwari',
        'Maybrat',
        'Raja Ampat',
        'Sorong Selatan',
        'Tambrauw',
        'Teluk Bintuni',
        'Teluk Wondama'],
      provinceId: 23
    },
    {
      id: 24,
      name: ['Bengkalis',
        'Dumai',
        'Indragiri Hilir',
        'Indragiri Hulu',
        'Kampar',
        'Kepulauan Meranti',
        'Kuantan Singingi',
        'Pekan Baru',
        'Pelalawan',
        'Rokan Hilir',
        'Rokan Hulu',
        'Siak'],

      provinceId: 24
    },
    {
      id: 25,
      name: ['Majene',
        'Mamasa',
        'Mamuju',
        'Mamuju Utara',
        'Polewali Mandar'],
      provinceId: 25
    },
    {
      id: 26,
      name: ['Bantaeng',
        'Barru',
        'Buleleng',
        'Bone',
        'Bulukumba',
        'Enrekang',
        'Gowa',
        'Jeneponto',
        'Kepulauan Selayar',
        'Luwu',
        'Luwu Timur',
        'Luwu Utara',
        'Makassar',
        'Maros',
        'Palopo',
        'Pangkajene Kepulauan',
        'Pare Pare',
        'Pinrang',
        'Sidenreng Rapang',
        'Sinjai',
        'Soppeng',
        'Takalar',
        'Tana Toraja',
        'Toraja Utara',
        'Wajo'],
      provinceId: 26
    },
    {
      id: 27,
      name: ['Banggai',
        'Banggai Kepulauan',
        'Buol',
        'Donggala',
        'Morowali',
        'Palu',
        'Parigi Moutong',
        'Poso',
        'Sigi',
        'Tojo Una Una',
        'Toli Toli'],
      provinceId: 27
    },
    {
      id: 28,
      name: ['Bombana',
        'Wakatobi',
        'Kolaka Utara',
        'Konawe Selatan',
        'Konawe Utara',
        'Buton Utara',
        'Kolaka Timur',
        'Konawe Kepulauan',
        'Konawe',
        'Buton Tengah',
        'Buton Selatan',
        'Muna Barat'],
      provinceId: 28
    },
    {
      id: 29,
      name: ['Bitung',
        'Bolaang Mongondow',
        'Bolaang Mongondow Selatan',
        'Bolaang Mongondow Timur',
        'Bolmong Utara',
        'Kepulauan Sangihe',
        'Kepulauan Siau Tagulandang Biaro',
        'Kepulauan Talaud',
        'Kotamobagu',
        'Manado',
        'Minahasa',
        'Minahasa Selatan',
        'Minahasa Tenggara',
        'Minahasa Utara',
        'Tomohon'],
      provinceId: 29
    },
    {
      id: 30,
      name: ['Agam',
        'Bukittinggi',
        'Dharmasraya',
        'Kepulauan Mentawai',
        'Lima Puluh Kota',
        'Padang',
        'Padang Panjang',
        'Padang Pariaman',
        'Pariaman',
        'Pasaman',
        'Pasaman Barat',
        'Payakumbuh',
        'Pesisir Selatan',
        'Sawah Lunto',
        'Sijunjung',
        'Solok',
        'Solok Selatan',
        'Tanah Datar'],
      provinceId: 30
    },
    {
      id: 31,
      name: ['Banyuasin',
        'Empat Lawang',
        'Lahat',
        'Lubuk Linggau',
        'Muara Enim',
        'Musi Banyuasin',
        'Musi Rawas',
        'Ogan Ilir',
        'Ogan Komering Ilir',
        'Ogan Komering Ulu',
        'Oku Selatan',
        'Oku Timur',
        'Pagar Alam',
        'Palembang',
        'Prabumulih'],
      provinceId: 31
    },
    {
      id: 32,
      name: ['Asahan',
        'Batubara',
        'Binjai',
        'Dairi',
        'Deli Serdang',
        'Gunung Sitoli',
        'Humbang Hasundutan',
        'Karo',
        'Labuhan Batu',
        'Labuhan Batu Selatan',
        'Labuhan Batu Utara',
        'Langkat',
        'Mandailing Natal',
        'Medan',
        'Nias',
        'Nias Barat',
        'Nias Selatan',
        'Nias Utara',
        'Padang Lawas',
        'Padang Lawas Utara',
        'Padang Sidempuan',
        'Pakpak Bharat',
        'Pematang Siantar',
        'Samosir',
        'Serdang Bedagai',
        'Sibolga',
        'Simalungun',
        'Tanjung Balai',
        'Tapanuli Selatan',
        'Tapanuli Tengah',
        'Tapanuli Utara',
        'Tebing Tinggi',
        'Toba Samosir'],
      provinceId: 32
    }
  ];
  arrayProvinceName: any = [];
  arrayCityByProvince: any = [];
  stateVerification: any;
  mask: any = ['+', '6', '2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) {
    this.getArrayProvince();
    if (this.navParams.get('stateVerification') == 0) {
      this.dataUser = this.navParams.get('dataUser');
      this.email = this.dataUser.email;
      this.stateVerification = this.navParams.get('stateVerification');
    } else {
      this.displayUser();
      this.tutorData();
    }
  }
  getArrayProvince() {
    this.province.forEach(e => {
      this.arrayProvinceName.push({ id: e.id, text: e.name });
    })
  }

  getProvince() {
    var index = this.dataTutor.provinceId;
    this.arrayCityByProvince = [];
    for (var key in this.city[index].name) {
      var value = this.city[index].name[key];
      this.arrayCityByProvince.push({ id: key, text: value })
    }
    this.dataTutor.provinceName = this.arrayProvinceName[index].text;
    // return this.arrayCityByProvince;
  }
  getCity() {
    var index = this.dataTutor.cityId;
    this.dataTutor.cityName = this.arrayCityByProvince[index].text;

    // return this.arrayCityByProvince;
  }
  displayTeacher(uid) {
    this.userService.viewTeacher(uid).once('value').then(snapshot => {
      var data = snapshot.val();
      this.dataTutor = data;
    })

  }


  displayUser() {
    var myuid = firebase.auth().currentUser.uid;
    this.userService.viewUser(myuid).once('value').then(snapshot => {
      var data = snapshot.val();
      this.email = data.email;
      data.key = snapshot.key;
      this.assignDataUser(data);
      // }).then(check =>{
      //   this.numsky=this.dataUser.phoneNumber;
      //     this.userService.viewUser(this.dataUser.uid).once('value',function(snapshot)  {
      //       var data = snapshot.val();
      //       this.dataTutor = data;
      //     })
    })


  }
  assignDataUser(data) {
    this.dataUser = data;
  }

  tutorData() {
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    var myuid = firebase.auth().currentUser.uid;
    this.userService.viewTutorProfile(myuid).once('value').then(snapshotData => {
      this.assignDataTutor(snapshotData.val());
      this.loading.dismissAll()
    });
  }
  assignDataTutor(data) {
    this.dataTutor = data;
    if (data.provinceId != null || data.provinceId != undefined) {
      this.getProvince();
    }
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public uploadImage(data, fileType) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.dataUser.key);

    const filename = fileType;
    const imageRef = storageRef.child(`${filename}.png`);

    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      var that = this;
      if (fileType == 'profile') {
        this.dataUser.avatar = snapshot.downloadURL;
        this.presentToast('Foto telah tersimpan');
        this.loading.dismissAll()
      } else {
        this.dataTutor.ktpUrl = snapshot.downloadURL;
        this.presentToast('KTP telah tersimpan');
        this.loading.dismissAll()
      }
    }, err => {
      this.presentToast('Error while uploading file');
    });

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
    if (fileType != 'KTP') {
      let options: CameraOptions = {
        quality: 50,
        sourceType: sourceType,
        saveToPhotoAlbum: true,
        allowEdit: true,
        destinationType: 0,
        encodingType: this.Camera.EncodingType.JPEG,
        mediaType: 0,
        correctOrientation: true
      };
      this.Camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        this.uploadImage(imagePath, fileType);
      }, err => {
        this.presentToast(JSON.stringify(err));
      });
    } else {
      let options: CameraOptions = {
        quality: 50,
        sourceType: sourceType,
        saveToPhotoAlbum: true,
        allowEdit: false,
        destinationType: 0,
        encodingType: this.Camera.EncodingType.JPEG,
        mediaType: 0,
        correctOrientation: true
      };
      this.Camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        this.uploadImage(imagePath, fileType);
      }, err => {
        this.presentToast(JSON.stringify(err));
      });
    }


    // Get the data of an image

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
  //   uploadFile(){
  //     var that = this;
  //     var extension,mimes;
  //       this.FileChooser.open().
  //       then(uri => {   if (this.platform.is('android')){
  //         this.loading = this.loadingCtrl.create({
  //           content:'<img src="./assets/loading.gif"/>',
  //           spinner:'hide'
  //         });
  //       this.loading.present();
  //         this.FilePath.resolveNativePath(uri).then((fileentry) => {
  //           if(fileentry.toString().charAt(fileentry.toString().length - 1) == 'f'){
  //             extension = '.pdf';
  //             mimes = 'application/pdf';
  //           }else if(fileentry.toString().charAt(fileentry.toString().length - 1) == 'x'){
  //             extension = '.docx';
  //             mimes = 'application/msword';
  //           }else if(fileentry.toString().charAt(fileentry.toString().length - 1) == 'c'){
  //             extension = '.doc';
  //             mimes = 'application/msword';
  //           }else{
  //             this.loading.dismiss();
  //             return this.presentToast('File harus menggunakan format .PDF');
  //           }
  //           try{
  //             this.makeFileIntoBlob(fileentry,extension,mimes).then((fileblob) => {
  //
  //               this.userService.addFile(fileblob, this.dataUser.key, 'cv', mimes, extension).then(success=>{
  //                  this.dataTutor.cvUrl = success.downloadURL;
  //                  this.presentToast('CV telah tersimpan');
  //                 return this.loading.dismiss();
  //               },error=>{
  //                 alert(JSON.stringify(error));
  //                 this.presentToast(error);
  //                 return this.loading.dismiss();
  //               })
  //
  //                   },error =>{
  //                     alert(JSON.stringify(error));
  //                     this.presentToast(error);
  //                     return this.loading.dismiss();
  //                   })
  //           }
  //           catch(error){
  //             return alert(error);
  //           }
  //
  //           }, error =>{
  //           alert('File tidak berada di dalam handphone anda, harap download ke dalam storage anda terlebih dahulu');
  //           return  this.loading.dismiss();
  //           })
  //
  //     }
  // },error=> {return this.presentToast('update versi android anda (min. 4.4.3)')});
  //    }
  //


  openMap(type, val) {
    let filterModal = this.modalCtrl.create(MapsPage);
    filterModal.present();
    filterModal.onDidDismiss(data => {
      if (data != null || data != undefined) {

        this.dataTutor.latitude = data.lat;
        this.dataTutor.longitude = data.lng;
        this.dataTutor.displayAddress = data.address;
      } else {
        return this.presentToast('Area mengajar belum terpilih')
      }
    })
  }

  saveProfile() {
    this.dataTutor.firstName = this.dataUser.firstName;
    this.dataTutor.lastName = this.dataUser.lastName;
    this.dataTutor.gender = this.dataUser.gender;
    this.dataTutor.uid = this.dataUser.key;

    if (this.dataTutor.ktpUrl == undefined || this.dataTutor.ktpUrl == null || this.dataTutor.ktpUrl == '') {
      return this.presentToast('Harap mengupload KTP');
    }
    if (this.dataTutor.cvUrl == undefined || this.dataTutor.cvUrl == null || this.dataTutor.cvUrl == '') {
      return this.presentToast('Harap mengupload CV');
    }
    if (this.dataTutor.latitude == -6.174668 || this.dataTutor.longitude == 106.827126) {
      return this.presentToast('Harap memilih lokasi mengajar anda');
    }
    if (this.numsky != this.dataUser.phoneNumber) {
      this.dataUser.smsVerificationStatus = false;
      let telpon = this.dataUser.phoneNumber.toString().split('');
      telpon = telpon.map((v: any) => {
        return v.replace(' ', '').replace('(', '').replace(')', '').replace("_", '').replace('-', '')
      });
      this.dataUser.phoneNumber = telpon.join('');
    }
    if (!this.dataUser.lastName) this.dataUser.lastName = '';
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    this.observerUser().take(1).subscribe(() => {
      this.loading.dismissAll();
    })

    // if(this.email != this.dataUser.email){
    //   firebase.auth().currentUser.updateEmail(this.dataUser.email).then(function(success){
    //     this.presentToast('Email anda terupdate : '+this.dataUser.email);
    //   },function(error){
    //     this.presentToast('error update email :'+error);
    //   })
    // }
    // firebase.database().ref('tutorProfile/'+this.dataUser.key).update().then(success=>{
    //   firebase.database().ref('users/'+this.dataUser.key).update().then(()=>{
    //       if(this.stateVerification <1 ){
    //         firebase.database().ref('users/'+this.dataUser.key).update({stateVerification:1});
    //       }
    //     this.presentToast('Profil Anda telah tersimpan');
    //     this.navCtrl.pop();
    //   },error =>{
    //     this.presentToast('Koneksi terputus');
    //     return this.platform.exitApp();
    //   });
    // },error=>{
    //   this.presentToast('Koneksi terputus');
    //   return this.platform.exitApp();
    // });

  }

  observerUser() {
    return new Observable((observer: any) => {
      this.userService.updateTutorProfile(this.dataUser.key, {
        namaRekening: this.dataTutor.namaRekening, displayAddress: this.dataTutor.displayAddress, rekening: this.dataTutor.rekening, cabang: this.dataTutor.cabang,
        bank: this.dataTutor.bank, about: this.dataTutor.about, address: this.dataTutor.address, avatar: this.dataUser.avatar, cityId: this.dataTutor.cityId,
        cityName: this.dataTutor.cityName, createDate: firebase.database.ServerValue.TIMESTAMP, cvUrl: this.dataTutor.cvUrl, dob: this.dataTutor.dob
        , email: this.dataUser.email, firstName: this.dataUser.firstName, fullName: this.dataUser.firstName + ' ' + this.dataUser.lastName, gender: this.dataUser.gender,
        jurusan: this.dataTutor.jurusan, ktpUrl: this.dataTutor.ktpUrl, lastName: this.dataTutor.lastName, latitude: this.dataTutor.latitude, longitude: this.dataTutor.longitude
        , pekerjaan: this.dataTutor.pekerjaan, phoneNumber: this.dataUser.phoneNumber, postalCode: this.dataTutor.postalCode, provinceId: this.dataTutor.provinceId, provinceName: this.dataTutor.provinceName
        , tingkatPendidikanTerakhir: this.dataTutor.tingkatPendidikanTerakhir, universitas: this.dataTutor.universitas, perguruanTinggi: ''
      }).then(success => {
        this.userService.updateTutorUser(this.dataUser.key, {
          email: this.dataUser.email, gender: this.dataUser.gender,
          firstName: this.dataUser.firstName, lastName: this.dataUser.lastName, phoneNumber: this.dataUser.phoneNumber,
          updateDate: firebase.database.ServerValue.TIMESTAMP, updateBy: this.dataUser.key,
          avatar: this.dataUser.avatar
        }).then(updated => {
          if (this.stateVerification < 1) {
            this.userService.updateTutorUser(this.dataUser.key, { stateVerification: 1 });
          }
          this.presentToast('Profil Anda telah tersimpan');
          this.navCtrl.pop();
          observer.next()
          observer.complete()
        }).catch(error => {
          this.presentToast(error);
          observer.next()
          observer.complete()
        });
      }).catch(error => {
        this.presentToast(error);
        observer.next()
        observer.complete()
      });
    })
  }

  forgetPass() {
    this.userService.forgotUser(this.dataUser.email).then(authData => {
      alert("Password telah dikirim ke email anda");
    }, error => {
      alert("Email anda tidak terdaftar");
    });
  };
  //   makeFileIntoBlob(_imagePath,extension,mimes) {
  // // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  //  return new Promise((resolve, reject) => {
  //    window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
  //      fileEntry.file((resFile) => {
  //    var reader = new FileReader();
  //    reader.onloadend = (evt: any) => {
  //      var imgBlob: any = new Blob([evt.target.result], { type: mimes });
  //      imgBlob.name = 'cv'+extension;
  //      return resolve(imgBlob);
  //    };
  //    reader.onerror = (e)=>{
  //      reject(e);
  //    }
  //    reader.onabort= (a)=>{
  //      reject(a);
  //    }
  //    reader.onprogress= (progress)=>{
  //      this.loading.data.content = progress.loaded + 'KB / ' + progress.total + ' KB';
  //    }
  //   reader.readAsArrayBuffer(resFile);
  //        });
  //      });
  //    });
  //  }
  uploadFile() {
    let cvModal = this.modalCtrl.create(CvPage, { uid: this.dataUser.uid });
    cvModal.present();
    cvModal.onDidDismiss(data => {
      if (data == null || data == undefined) {
        this.dataTutor.cvUrl = null;
        return this.presentToast('Cv belum terisi');
      } else if (data == 'gagal') {
        this.dataTutor.cvUrl = null;
        return this.presentToast('Cv belum terisi');
      } else {
        this.dataTutor.cvUrl = 'success';
        return this.presentToast('Cv diterima');
      }
    })
  }
}
