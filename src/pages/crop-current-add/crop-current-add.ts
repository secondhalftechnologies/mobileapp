import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CropCurrentAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-current-add',
  templateUrl: 'crop-current-add.html',
})
export class CropCurrentAddPage {
	current: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.current = formBuilder.group({
			'f14_points' : [''],
			
			'f14_crop_type' : [''],
			'f14_cultivating' : [''],
			'f14_variety' : [''],
			'f14_total_acrage' : [''],
			'f14_expected_yeild' : [''],
			'f14_seed_type' : [''],
			'f14_seed_quantity' : [''],
			'f14_spend_money' : [''],
			'f14_use_self_grown_seeds' : [''],
			'f14_loan_taken' : [''],
			'f14_loan_amount' : [''],
			'f14_borrow_loan_from' : [''],
			'f14_diseases' : [''],
			'f14_water_source_type' : [''],
			'f14_harvest_date' : [''],
			'f14_income' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LandFarmAddPage');
	}

	save(){
		if (this.current.valid) {
			console.log(this.current.value);
		}else{
			console.log('Validation error');
		}
	}
}
