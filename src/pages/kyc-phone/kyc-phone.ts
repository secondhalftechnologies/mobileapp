import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the KycPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-phone',
  templateUrl: 'kyc-phone.html',
})
export class KycPhonePage {

  phone: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.phone = formBuilder.group({
			'f5_points' : [''],

			'f5_phonetype' : ['', Validators.required],
			'f5_any_one_have_smart_phone' : ['', Validators.required],
			'f5_servpro' : [''],
			'f5_network' : [''],
			'f5_datapack' : [''],
			'f5_datapackname' : [''],
			'f5_appuse' : [''],
			'f5_app_name' : ['', Validators.required],
			'f5_farmapp' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');
	}

	save(){
		if (this.phone.valid) {
			console.log(this.phone.value);
		}else{
			console.log('Validation error');
		}
	}

}
