import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the KycKnowledgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-knowledge',
  templateUrl: 'kyc-knowledge.html',
})
export class KycKnowledgePage {

	knowledge: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private loadingCtrl: LoadingController) {
		this.knowledge = formBuilder.group({
			'f2_points' : [''],

			'f2_edudetail' : ['', Validators.required],
			'f2_proficiency' : ['', Validators.required],
			'f2_participation' : [''],
			'f2_typeprog' : ['', Validators.required],
			'f2_durprog' : ['', Validators.required],
			'f2_condprog' : ['', Validators.required],
			'f2_cropprog' : ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();
		console.log('ionViewDidLoad KycKnowledgePage');
		setTimeout(() => {
		    loading.dismiss();
		}, 1000);
	}

	save(){
		if (this.knowledge.valid) {
			console.log(this.knowledge.value);
		}else{
			console.log('Validation error');
		}
	}
}
