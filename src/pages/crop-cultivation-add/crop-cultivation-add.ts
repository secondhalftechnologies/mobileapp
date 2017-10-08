import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CropCultivationAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation-add',
  templateUrl: 'crop-cultivation-add.html',
})
export class CropCultivationAddPage {
	cultivation: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.cultivation = formBuilder.group({
			'f10_points' : [''],
			
			'f10_crop_season' : [''],
			'f10_cultivating' : [''],
			'f10_stage' : [''],
			'f10_expected' : [''],
			'f10_potential_market' : [''],
			'f10_crop_storage' : [''],
			'f10_expectedprice' : [''],
			'f10_expectedincome' : [''],
			'f10_diseases' : [''],
			'f10_pest' : [''],
			'f10_filt_type' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LandFarmAddPage');
	}

	save(){
		if (this.cultivation.valid) {
			console.log(this.cultivation.value);
		}else{
			console.log('Validation error');
		}
	}
}
