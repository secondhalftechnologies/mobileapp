import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AssetsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-details',
  templateUrl: 'assets-details.html',
})
export class AssetsDetailsPage {

	assets: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f12_points' : [''],

			'f12_vehicle' : ['', Validators.required],
			'f12_total_val_of_vehical' : [''],
			'f12_machinery' : [''],
			'f12_total_val_of_machinery' : [''],
			'f12_any_other_assets' : [''],
			'f12_name_of_other_assets' : [''],
			'f12_mention_value_of_assets' : [''],
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
