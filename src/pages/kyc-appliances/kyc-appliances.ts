import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the KycAppliancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-appliances',
  templateUrl: 'kyc-appliances.html',
})
export class KycAppliancesPage {

  appliances: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.appliances = formBuilder.group({
			'f6_points' : [''],

			'f7_television' : ['', Validators.required],
			'f7_refrigerator' : ['', Validators.required],
			'f7_wmachine' : ['', Validators.required],
			'f7_mixer' : ['', Validators.required],
			'f7_stove' : ['', Validators.required],
			'f7_bicycle' : ['', Validators.required],
			'f7_ccylinder' : ['', Validators.required],
			'f7_fans' : ['', Validators.required],
			'f7_motorcycle' : ['', Validators.required],
			'f7_car' : ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');
	}

	save(){
		if (this.appliances.valid) {
			console.log(this.appliances.value);
		}else{
			console.log('Validation error');
		}
	}

}
