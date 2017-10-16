import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AssetsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-details',
  templateUrl: 'assets-details.html',
})
export class AssetsDetailsPage {

	assets: FormGroup;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.assets = formBuilder.group({
			'f12_points' : ['0'],

			'f12_vehicle' : ['', Validators.required],
			'f12_total_val_of_vehical' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_machinery' : ['', Validators.required],
			'f12_total_val_of_machinery' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f12_any_other_assets' : [''],
			'f12_name_of_other_assets' : [''],
			'f12_mention_value_of_assets' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
		});
	}

	setValidation(){
		let controls = this.assets.controls;
		if(controls['f12_any_other_assets'].value == 'yes'){
			controls['f12_name_of_other_assets'].enable();
			controls['f12_mention_value_of_assets'].enable();
		}
		else{
			controls['f12_name_of_other_assets'].setValue('', { emitEvent: false });
			controls['f12_mention_value_of_assets'].setValue('', { emitEvent: false });
			controls['f12_name_of_other_assets'].disable();
			controls['f12_mention_value_of_assets'].disable();
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AssetsDetailsPage');

		this.setValidation();
		//Listen for form changes
		this.assets.controls['f12_any_other_assets'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal();
		});

		this.assets.controls['f12_vehicle'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		this.assets.controls['f12_total_val_of_vehical'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		this.assets.controls['f12_machinery'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		this.assets.controls['f12_total_val_of_machinery'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		this.assets.controls['f12_mention_value_of_assets'].valueChanges.subscribe(() => {
			this.getTotal();
		});

	}

	getTotal(){
		let values = this.assets.getRawValue();
		let points = {};
		let total:number = 0;
		points['f12_vehicle']                 = 0;
		points['f12_total_val_of_vehical']    = 0;
		points['f12_machinery']               = 0;
		points['f12_total_val_of_machinery']  = 0;
		points['f12_mention_value_of_assets'] = 0;


		//setting points based on values
		//f12_vehicle
		switch (values['f12_vehicle']) {
			case "1":
				points['f12_vehicle'] = 5;
				break;
			case "2":
				points['f12_vehicle'] = 7;
				break;
			case "3":
				points['f12_vehicle'] = 8;
				break;
			case "4_or_more":
				points['f12_vehicle'] = 10;
				break;
		}

		//f12_total_val_of_vehical
		switch (values['f12_total_val_of_vehical']) {
			case values['f12_total_val_of_vehical'] >= 0 && values['f12_total_val_of_vehical'] <= 50000:
				points['f12_total_val_of_vehical'] = 2;
				break;
			case values['f12_total_val_of_vehical'] >= 50001 && values['f12_total_val_of_vehical'] <= 100000:
				points['f12_total_val_of_vehical'] = 4;
				break;
			case values['f12_total_val_of_vehical'] >= 100001 && values['f12_total_val_of_vehical'] <= 500000:
				points['f12_total_val_of_vehical'] = 6;
				break;
			case values['f12_total_val_of_vehical'] >= 500001 && values['f12_total_val_of_vehical'] <= 1000000:
				points['f12_total_val_of_vehical'] = 8;
				break;
			case values['f12_total_val_of_vehical'] > 1000000:
				points['f12_total_val_of_vehical'] = 10;
				break;
		}

		//f12_machinery
		switch (values['f12_machinery']) {
			case "1":
				points['f12_machinery'] = 2;
				break;
			case "2":
				points['f12_machinery'] = 4;
				break;
			case "3":
				points['f12_machinery'] = 6;
				break;
			case "4_or_more":
				points['f12_machinery'] = 0;
				break;
		}

		//f12_total_val_of_machinery
		switch (values['f12_total_val_of_machinery']) {
			case values['f12_total_val_of_machinery'] >= 0 && values['f12_total_val_of_machinery'] <= 50000:
				points['f12_total_val_of_machinery'] = 2;
				break;
			case values['f12_total_val_of_machinery'] >= 50001 && values['f12_total_val_of_machinery'] <= 100000:
				points['f12_total_val_of_machinery'] = 4;
				break;
			case values['f12_total_val_of_machinery'] >= 100001 && values['f12_total_val_of_machinery'] <= 500000:
				points['f12_total_val_of_machinery'] = 6;
				break;
			case values['f12_total_val_of_machinery'] >= 500001 && values['f12_total_val_of_machinery'] <= 1000000:
				points['f12_total_val_of_machinery'] = 8;
				break;
			case values['f12_total_val_of_machinery'] > 1000000:
				points['f12_total_val_of_machinery'] = 10;
				break;
		}


		//f12_mention_value_of_assets
		switch (values['f12_mention_value_of_assets']) {
			case values['f12_mention_value_of_assets'] >= 0 && values['f12_mention_value_of_assets'] <= 50000:
				points['f12_mention_value_of_assets'] = 2;
				break;
			case values['f12_mention_value_of_assets'] >= 50001 && values['f12_mention_value_of_assets'] <= 100000:
				points['f12_mention_value_of_assets'] = 4;
				break;
			case values['f12_mention_value_of_assets'] >= 100001 && values['f12_mention_value_of_assets'] <= 500000:
				points['f12_mention_value_of_assets'] = 6;
				break;
			case values['f12_mention_value_of_assets'] >= 500001 && values['f12_mention_value_of_assets'] <= 1000000:
				points['f12_mention_value_of_assets'] = 8;
				break;
			case values['f12_mention_value_of_assets'] > 1000000:
				points['f12_mention_value_of_assets'] = 10;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		if(values['f12_any_other_assets'] == 'yes'){
			total = parseFloat((total/5).toFixed(2));
		}
		else{
			total = parseFloat((total/4).toFixed(2));
		}

		this.assets.get('f12_points').setValue(total, { emitEvent: false });
	}

	save(){
		if (this.assets.valid) {
			console.log(this.assets.value);
		}else{
			console.log('Validation error');
		}
	}

}
