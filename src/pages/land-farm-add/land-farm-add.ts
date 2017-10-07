import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the LandFarmAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-land-farm-add',
  templateUrl: 'land-farm-add.html',
})
export class LandFarmAddPage {

    land: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.land = formBuilder.group({
			'f9_points' : [''],

			'f9_land_size1' : ['', Validators.required],
			'f9_owner1' : ['', Validators.required],
			'f9_lease_year1' : [''],
			'f9_amount_on_rent1' : [''],
			'f9_contract_year1' : [''],
			'f9_state1' : [''],
			'f9_district1' : ['', Validators.required],
			'f9_taluka1' : [''],
			'f9_vilage1' : [''],
			'f9_survey_number1' : [''],
			'f9_pincode1' : [''],
			'f9_lat1' : [''],
			'f9_long1' : [''],
			'f9_soil_type1' : [''],
			'f9_soil_tested1' : [''],
			'f9_soil_depth1' : [''],
			'f9_source_of_water1' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LandFarmAddPage');
	}

	save(){
		if (this.land.valid) {
			console.log(this.land.value);
		}else{
			console.log('Validation error');
		}
	}
	

}
