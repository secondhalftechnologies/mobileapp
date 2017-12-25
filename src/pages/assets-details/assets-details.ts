import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

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
	submitAttempt: boolean = false;
	addNew: boolean        = true;
	farmer_id: string;
	ca_id: string;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public formBuilder: FormBuilder, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
				private api: Api) 
	{
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


	ionViewDidEnter() {
		console.log('ionViewDidLoad AssetsDetailsPage');
		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		//get data from server
		this.api.get('assets_details/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data[0] != undefined){
						this.addNew = false;
						let webData = data.data[0];
						for (let key in webData) {
							if(this.assets.controls[key] != undefined){
								this.assets.controls[key].setValue(webData[key]);
							}
						}
					}
				}

				loading.dismiss();
				// this.showMessage("All * marked fields are mandatory!", "black");
			}, 
			err => {
				console.log(err);
				setTimeout(() => {
				    loading.dismiss();
					this.showMessage("Something went wrong, make sure that Internet connection is on!", "danger");
				}, 1000);
			}
		);
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

		this.submitAttempt = true;
		if (this.assets.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.assets.value;
			formData['fm_id'] = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('assets_details', formData)
				.map(res => res.json())
				.subscribe(data => {
					
				    loading.dismiss();
					if(data.success){		
						this.navCtrl.pop();
					}else{
						this.showMessage("Some thing went wrong!, Please try again.", "danger");
					}

				}, err => {
					console.log(err);
					this.showMessage("Data not updated, please try again!", "danger");
				    loading.dismiss();
				});
			}
			else{
				//do put request
				this.api.put('assets_details', formData)
				.map(res => res.json())
				.subscribe(data => {

				    loading.dismiss();
				    if(data.success){		
						this.navCtrl.pop();
					}else{
						this.showMessage("Some thing went wrong!, Please try again.", "danger");
					}
					
				}, err => {
					console.log(err);
					this.showMessage("Data not updated, please try again!", "danger");
				    loading.dismiss();
				});
			}

		}else{
			console.log('Validation error', this.assets.controls);
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}

	//Message toaster
	showMessage(message, style: string, dur?: number){
		const toast = this.toastCtrl.create({
	      message: message,
	      showCloseButton: true,
	      duration: dur || 5000,
	      closeButtonText: 'Ok',
	      cssClass: style,
	      dismissOnPageChange: true
	    });

	    toast.present();
	}

}
