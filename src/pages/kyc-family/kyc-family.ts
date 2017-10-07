import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the KycFamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-family',
  templateUrl: 'kyc-family.html',
})
export class KycFamilyPage {

  family: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.family = formBuilder.group({
			'f6_points' : [''],

			'f6_jointfamily' : ['', Validators.required],
			'f6_members' : ['', Validators.required],
			'f6_children' : ['', Validators.required],
			'f6_smartuse' : ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');
	}

	save(){
		if (this.family.valid) {
			console.log(this.family.value);
		}else{
			console.log('Validation error');
		}
	}

}
