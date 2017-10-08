import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CropCurrentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-current',
  templateUrl: 'crop-current.html',
})
export class CropCurrentPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CropCurrentPage');
	}

	addnew(id: string){
		if(id){

		}else{
			this.navCtrl.push('CropCurrentAddPage');
		}
	}

}
