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
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f13_points' : ['0'],

			'f13_dairy_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_draft_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_buffalo' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_ox' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_sheep' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_goat' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_pig' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_poultry' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_donkeys' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AssetsDetailsPage');

		this.assets.valueChanges.subscribe(() => {
			this.getTotal();
		});
	}

	getTotal(){
		let values = this.assets.getRawValue();
		let total:number = 0;
		let points:number = 0;
		
		
		for( let val in values){
			if(values[val]){
				points += parseInt(values[val]);
				console.log(points);
			}
		}

		switch (true) {
			case (points >= 0 && points <= 50):
				total = 4;
				break;
			case (points >= 51 && points <= 100):
				total = 6;
				break;
			case (points >= 101 && points <= 150):
				total = 10;
				break;
		}

		console.log(points);
		console.log(total);
		total = parseFloat((total).toFixed(2));

		this.assets.get('f13_points').setValue(total, { emitEvent: false });
	}

	save(){
		this.submitAttempt = true;

		if (this.assets.valid) {
			console.log(this.assets.value);
		}else{
			console.log('Validation error');
		}
	}

}
