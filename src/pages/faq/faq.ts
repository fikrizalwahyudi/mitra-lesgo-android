import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Faq page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html'
})
export class FaqPage {
  shownGroup: any = null;
  question = [
    { title: "Apa itu LESGO?", description: "LESGO! adalah fitur berbasis web dan mobile aplikasi untuk membantu calon Murid mendapatkan Guru Les Privat yang berkualitas dan terpercaya." },
    { title: "Dimana Kantor LESGO! ?", description: "Kantor LESGO! berlokasi di Boston Squere RK3 No.35 Kota Wisata, Cibubur, Bogor, Jawa Barat" },
    { title: "Siapa CEO LESGO! ?", description: "Sang Made Kresna Andika, ybs Lulusan Fakultas Teknik Gas dan Petrokimia Universitas Indonesia, Member of Indonesia Petroleum Association dan Oil and Gas Professional." },
    { title: "Bagaimana sistem operasi LESGO! ?", description: "LESGO! hadir melalui situs website dan Aplikasi Android dan Aplikasi IOS." },
    { title: "Kapan berdirinya LESGO! ?", description: "Badan Hukum PT. Lesgo Indonesia Pintar berdiri sejak 22 Januari 2016." },
    { title: "Arti Logo LESGO! ?", description: "Pensil dan kata LESGO!. LESGO! terdiri dari dua kata utama Les dan Go. Kata Les artinya menyediakan Guru Les Privat dan kata Go artinya ajakan untuk menggunakan fitur LESGO! untuk mempelajari hal yang ingin dikuasai. Logo Pensil memiliki banyak filosofi diantaranya adalah sebagai alat untuk membuat konsep atau memulai sesuatu. Pensil tidak akan mampu menghasilkan apapun tanpa ada tangan yang membimbingnya. LESGO! Diibaratkan sebagai tangan yang membimbing pensil untuk menghasilkan output yang lebih baik dan positif." },
    { title: "Bagaimana prosedur pendaftaran menjadi Guru Les Privat ?", description: "Pendaftaran Guru les privat dapat dilakukan melalui website : www.les-go.com, aplikasi Android dan iOS atau pada acara-acara recruitment yang diadakan oleh LESGO!." },
    { title: "Apakah Guru bisa menolak pemesanan Murid ?", description: "Guru tidak diperbolehkan untuk menolak order dari Murid. Jika Guru berkeinginan tidak menerima order dari Murid pada periode tertentu dapat meng non aktifkan profile Guru dari sistem atau menginformasikan ke Customer Service untuk menon-aktifkan profile Guru." },
    { title: "Bagaimana jika Guru berhalangan hadir untuk mengajar les ?", description: "Murid atau Orang Tua memilih tingkat pendidikan, kemudian mata pelajaran atau subject yang ingin dipelajari. Jika telah menemukan guru yang diinginkan, Murid dapat memilih jumlah pertemuan per minggu, dan memilih hari dan jam untuk setiap pertemuan." },
    { title: "Apakah Guru dapat merubah alamat domisili Guru?", description: "Pemberitahuan ke Customer Service/Manajemen LESGO! dan verifikasi dari LESGO!" },
    { title: "Jika bisa, bagaimana prosedur perubahan alamat domisili tersebut?", description: "Bisa." },
    { title: "Bagaimana proses perekrutan Guru ?", description: "Sama dengan pendaftaran." },
    { title: "Bagaimana pembayaran jasa LESGO! kepada Mitra Guru LESGO! ?", description: "Mingguan (setiap hari Senin) dengan cara transfer bank, sesuai dengan ketentuan yang berlaku." },
    { title: "Kenapa jarak mengajar les di surat pernyataan dibatasi 7 km, apakah tidak terlalu jauh dan tidak terlalu dekat ?", description: "Berdasarkan hasil riset awal 7 km merupakan jarak optimum dan dianggap tidak memberatkan Guru. Kedepannya jarak ini akan diperkecil sejalan dengan perkembangan jumlah Guru, sesuai dengan jumlah Guru di populasi tersebut." },
    { title: "Bagaimana prosedur berhenti menjadi Mitra Guru LESGO! ?", description: "Menyelesaikan semua kewajiban dan komitmen mengajar. Mengisi formulir pengunduran diri Menghubungi customer service/ manajemen LESGO!" },
    { title: "Jika Guru sudah mengajar sekali atau lebih dan tidak dilanjutkan karena permintaan Murid, apakah ada jaminan pembayaran atas jasa Guru 1 hari atau lebih tersebut?", description: "Pembayaran dilakukan mingguan sesuai jumlah jasa yg terpenuhi." },
    { title: "Bagaimana prosedur pendaftaran Murid ?", description: "Pendaftaran Murid les privat dapat dilakukan melalui website : www.les-go.com, aplikasi Android dan iOS." },
    { title: "Siapa yang melakukan pendaftaran Murid ?", description: "Pengguna Jasa dan/atau Orang Tua." },
    { title: "Bagaimana sistem pemilihan Guru les?", description: "Murid atau Orang Tua memilih tingkat pendidikan, kemudian mata pelajaran atau subject yang ingin dipelajari. Jika telah menemukan guru yang diinginkan, Murid dapat memilih jumlah pertemuan per minggu, dan memilih hari dan jam untuk setiap pertemuan." },
    { title: "Bagaimana cara pemesanan jadwal les privat?", description: "Murid memilih jadwal yg tersedia dari Guru yang diinginkan." },
    { title: "Apakah Murid bisa membatalkan jadwal les ?", description: "Bisa." },
    { title: "Jika bisa, apakah ada time limit nya ?", description: "Time limit nya 24 Jam sebelum jadwal les. jika melebihi dari time limit, uang les pada hari tersebut akan hangus, kecuali kondisi force major." },
    { title: "Bagaimana cara melakukan pembayaran oleh Murid ?", description: "Pembayaran secara full di muka. Menggunakan credit card, debit atau Bank Transfer." },
    { title: "Apakah Murid bisa mengganti Guru les ?", description: "Bisa. Apabila guru pengganti memiliki harga lebih tinggi, Murid harus membayar kekurangan biaya, tapi jika harga Guru lebih murah, maka akan menjadi tambahan kredit ke customer." },
    { title: "Apakah ada paket spesial untuk les jangka panjang, misal 1 semester?", description: "Paket spesial akan disampaikan oleh LESGO! secara resmi didalam aplikasi atau media sosial." },
    { title: "Berapa batas maksimum murid bisa mengganti Guru?", description: "(1 kali) atau setelah paket regular selesai. LESGO! akan menawarkan bantuan utk rekomendasi guru yg sesuai dengan keinginan anda jika guru yang dipilih tidak sesuai/cocok dg Murid." },
    { title: "Apakah ada garansi uang kembali jika Murid tidak cocok dengan Mitra Guru LESGO! ?", description: "LESGO! memberikan garansi penggantian Guru gratis untuk menggantikan pertemuan pertama dengan Guru sebelumnya." }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };

}
