import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/providers';

/**
 * Generated class for the PreloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-preload',
	templateUrl: 'preload.html',
})
export class PreloadPage {

 	constructor(public navCtrl: NavController, 
 		private auth: AuthService,
 		public navParams: NavParams) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad PreloadPage');
 		this.auth.isAuthenticated().subscribe(success => {
 			if(success){
 				this.navCtrl.setRoot('HomePage');
 			}
 			else{
 				this.navCtrl.setRoot('LoginPage');
 			}
 		});
 	}

}
