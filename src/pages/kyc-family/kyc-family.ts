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
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.family = formBuilder.group({
			'f6_points' : ['0'],

			'f6_jointfamily' : ['', Validators.required],
			'f6_members' : ['', Validators.required],
			'f6_children' : ['', Validators.required],
			'f6_smartuse' : ['', Validators.required],
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');

		//Listen for form changes
		this.family.valueChanges.subscribe(() => {
			this.getTotal()
		});

	}

	getTotal(){
		let values = this.family.getRawValue();
		let points = {};
		let total:number = 0;
		points['f6_children'] = 0;
		points['f6_smartuse'] = 0;

		//setting points based on values
		//f6_children
		switch (true) {
			case values['f6_children'] >= 0 && values['f6_children'] <= 2:
				points['f6_children'] = 10;
				break;
			case values['f6_children'] >= 3 && values['f6_children'] <= 5:
				points['f6_children'] = 4;
				break;
			case values['f6_children'] >= 6 && values['f6_children'] <= 7:
				points['f6_children'] = 2;
				break;
			case values['f6_children'] > 7:
				points['f6_children'] = 0;
				break;
		}


		//f6_smartuse
		switch (values['f6_smartuse']) {
			case "yes":
				points['f6_smartuse'] = 10;
				break;
			case "no":
				points['f6_smartuse'] = 0;
				break;
		}

		
		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);

		total = parseFloat((total/2).toFixed(2));
		this.family.get('f6_points').setValue(total, { emitEvent: false });
	}

	save(){
		this.submitAttempt = true;
		if (this.family.valid) {
			console.log(this.family.value);
		}else{
			console.log('Validation error');
		}
	}

}
