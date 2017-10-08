import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CropPreviousAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-previous-add',
  templateUrl: 'crop-previous-add.html',
})
export class CropPreviousAddPage {

  	previous: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.previous = formBuilder.group({
			'f11_points' : [''],

			'f11_cultivating' : [''],
			'f11_achieved' : [''],
			'f11_income' : [''], 
			'f11_diseases' : [''],
			'f11_fertilizers' : [''],
			'f11_consumption_fertilizer' : [''],
			'f11_damaged_prev_crop' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LandFarmAddPage');
	}

	save(){
		if (this.previous.valid) {
			console.log(this.previous.value);
		}else{
			console.log('Validation error');
		}
	}

}
