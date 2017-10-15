import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the CropCultivationAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation-add',
  templateUrl: 'crop-cultivation-add.html',
})
export class CropCultivationAddPage {
	cultivation: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.cultivation = formBuilder.group({
			'f10_points' : ['0'],
			
			'f10_crop_season' : ['', Validators.required],
			'f10_cultivating' : ['', Validators.required],
			'f10_stage' : ['', Validators.required],
			'f10_expected' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f10_potential_market' : ['', Validators.required],
			'f10_crop_storage' : ['', Validators.required],
			'f10_expectedprice' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
			'f10_expectedincome' : ['', Validators.compose([ Validators.required, Validators.maxLength(6), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')])],
			'f10_diseases' : ['', Validators.required],
			'f10_pest' : ['', Validators.required],
			'f10_filt_type' : ['', Validators.required],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad cultivationFarmAddPage');

		//Listen for form changes
		this.cultivation.controls['f10_stage'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		//Listen for form changes
		this.cultivation.controls['f10_expected'].valueChanges.subscribe(() => {
			this.getTotal();
		});

		//Listen for form changes
		this.cultivation.controls['f10_filt_type'].valueChanges.subscribe(() => {
			this.getTotal();
		});

	}

	getTotal(){
		let values = this.cultivation.getRawValue();
		let points = {};
		let total:number = 0;
		points['f10_stage']     = 0;
		points['f10_expected']  = 0;
		points['f10_filt_type'] = 0;

		//f10_stage
		switch (values['f10_stage']) {
			case "cultivation Tilling":
				points['f10_stage'] = 5;
				break;
			case "Sowing":
				points['f10_stage'] = 7;
				break;
			case "Manure Adding":
				points['f10_stage'] = 6;
				break;
			case "Irrigation":
				points['f10_stage'] = 7;
				break;
			case "Weeding":
				points['f10_stage'] = 7;
				break;
			case "Growing":
				points['f10_stage'] = 8;
				break;
			case "Harvesting":
				points['f10_stage'] = 7;
				break;
			case "Threshing":
				points['f10_stage'] = 5;
				break;
			case "Storing":
				points['f10_stage'] = 2;
				break;
			
		}

		//setting points based on values
		//f10_expected
		switch (true) {
			case values['f10_expected'] >= 1 && values['f10_expected'] <= 20:
				points['f10_expected'] = 5;
				break;
			case values['f10_expected'] >= 21 && values['f10_expected'] <= 40:
				points['f10_expected'] = 6;
				break;
			case values['f10_expected'] >= 41 && values['f10_expected'] <= 60:
				points['f10_expected'] = 7;
				break;
			case values['f10_expected'] >= 61 && values['f10_expected'] <= 80:
				points['f10_expected'] = 8;
				break;
			case values['f10_expected'] >= 81 && values['f10_expected'] <= 100:
				points['f10_expected'] = 9;
				break;
		}

		//f10_filt_type
		switch (values['f10_filt_type']) {
			case "Organic Fertilizers":
				points['f10_filt_type'] = 10;
				break;
			case "Inorganic Fertilizers":
				points['f10_filt_type'] = 5;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		total = parseFloat((total/3).toFixed(2));
		this.cultivation.get('f10_points').setValue(total, { emitEvent: false });
	}

	save(){
		this.submitAttempt = true;
		if (this.cultivation.valid) {
			console.log(this.cultivation.value);
		}else{
			console.log('Validation error');
		}
	}
}
