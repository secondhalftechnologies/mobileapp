import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AssetsStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-stock',
  templateUrl: 'assets-stock.html',
})
export class AssetsStockPage {

	assets: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f13_points' : [''],

			'f13_dairy_cattle' : [''],
			'f13_draft_cattle' : [''],
			'f13_buffalo' : [''],
			'f13_ox' : [''],
			'f13_sheep' : [''],
			'f13_goat' : [''],
			'f13_pig' : [''],
			'f13_poultry' : [''],
			'f13_donkeys' : [''],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AssetsDetailsPage');
	}

	save(){
		if (this.assets.valid) {
			console.log(this.assets.value);
		}else{
			console.log('Validation error');
		}
	}

}
