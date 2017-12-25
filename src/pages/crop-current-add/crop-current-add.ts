import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the CropCurrentAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-current-add',
  templateUrl: 'crop-current-add.html',
})
export class CropCurrentAddPage {

	current: FormGroup;
  	submitAttempt: boolean = false;
  	addNew: boolean        = true;
	farmer_id: string;
	ca_id: string;
	id: any;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public formBuilder: FormBuilder, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
				private api: Api) 
	{
		this.current = formBuilder.group({
			'f14_points' : ['0'],
			
			'f14_crop_type' : ['', Validators.required ],
			'f14_cultivating' : ['', Validators.required ],
			'f14_variety' : ['', Validators.required ],
			'f14_total_acrage' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f14_expected_yeild' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f14_seed_type' : ['', Validators.required ],
			'f14_seed_quantity' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f14_spend_money' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f14_use_self_grown_seeds' : ['', Validators.required ],
			'f14_loan_taken' : ['', Validators.required ],
			'f14_loan_amount' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f14_borrow_loan_from' : ['', Validators.required ],
			'f14_diseases' : ['', Validators.required ],
			'f14_water_source_type' : ['', Validators.required ],
			'f14_harvest_date' : ['', Validators.required ],
			'f14_income' : ['', Validators.required ],
			
		});
		

		//Listen for form changes
		this.current.controls['f14_seed_type'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.current.controls['f14_loan_taken'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal();
		});
		this.current.controls['f14_loan_amount'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.current.controls['f14_borrow_loan_from'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.current.controls['f14_water_source_type'].valueChanges.subscribe(() => {
			this.getTotal();
		});
	}

	setValidation(){
		let controls = this.current.controls;
		if(controls['f14_loan_taken'].value == 'yes'){
			controls['f14_loan_amount'].enable();
			controls['f14_borrow_loan_from'].enable();
		}
		else{
			controls['f14_loan_amount'].setValue('', { emitEvent: false });
			controls['f14_borrow_loan_from'].setValue('', { emitEvent: false });
			controls['f14_loan_amount'].disable();
			controls['f14_borrow_loan_from'].disable();
		}
	}


	ionViewDidEnter() {
		console.log('ionViewDidLoad LandFarmAddPage');
		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;
		this.id = this.navParams.get('id') || false;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		if(this.id !== false){
			//get data from server
			this.api.get('crop_current/'+ this.id)
			.map(res => res.json())
			.subscribe(
				data => {
					if(data.success){
						if(data.data[0] != undefined){
							this.addNew = false;
							let webData = data.data[0];
							for (let key in webData) {
								if(this.current.controls[key] != undefined){
									this.current.controls[key].setValue(webData[key]);
								}
							}
						}
					}

					loading.dismiss();
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
		else{
			setTimeout(() => {
			    loading.dismiss();
			}, 100);
		}
	}

	getTotal(){
		let values = this.current.getRawValue();
		let points = {};
		let total:number = 0;
		points['f14_seed_type']         = 0;
		points['f14_loan_taken']        = 0;
		points['f14_loan_amount']       = 0;
		points['f14_borrow_loan_from']  = 0;
		points['f14_water_source_type'] = 0;


		//setting points based on values
		//f14_seed_type
		switch (values['f14_seed_type']) {
			case "Hybrid":
				points['f14_seed_type'] = 10;
				break;
			case "Non-hybrid":
				points['f14_seed_type'] = 0;
				break;
		}

		//f14_loan_taken
		switch (values['f14_loan_taken']) {
			case "yes":
				points['f14_loan_taken'] = 0;
				break;
			case "no":
				points['f14_loan_taken'] = 10;
				break;
		}

		//f14_loan_amount
		switch (values['f14_loan_amount']) {
			case values['f14_loan_amount'] >= 0 && values['f14_loan_amount'] <= 5000:
				points['f14_loan_amount'] = 10;
				break;
			case values['f14_loan_amount'] >= 5001 && values['f14_loan_amount'] <= 15000:
				points['f14_loan_amount'] = 8;
				break;
			case values['f14_loan_amount'] >= 15001 && values['f14_loan_amount'] <= 30000:
				points['f14_loan_amount'] = 6;
				break;
			case values['f14_loan_amount'] >= 30001 && values['f14_loan_amount'] <= 45000:
				points['f14_loan_amount'] = 4;
				break;
			case values['f14_loan_amount'] > 45000:
				points['f14_loan_amount'] = 2;
				break;
		}
		
		//f14_borrow_loan_from
		switch (values['f14_borrow_loan_from']) {
			case "Cooprative Bank":
				points['f14_borrow_loan_from'] = 0;
				break;
			case "Bank":
				points['f14_borrow_loan_from'] = 10;
				break;
			case "MFI OR NBFC":
				points['f14_borrow_loan_from'] = 8;
				break;
			case "FPO":
				points['f14_borrow_loan_from'] = 6;
				break;
			case "Money Lender":
				points['f14_borrow_loan_from'] = 0;
				break;
			case "Other Lending Institutions":
				points['f14_borrow_loan_from'] = 2;
				break;
		}

		//f14_water_source_type
		switch (values['f14_water_source_type']) {
			case "Rainwater Only":
				points['f14_water_source_type'] = 2;
				break;
			case "Irrigation":
				points['f14_water_source_type'] = 8;
				break;
			case "Canals":
				points['f14_water_source_type'] = 4;
				break;
			case "Others":
				points['f14_water_source_type'] = 6;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		if(values['f14_loan_taken'] == 'yes'){
			total = parseFloat((total/5).toFixed(2));
		}else{
			total = parseFloat((total/3).toFixed(2));
		}
		this.current.get('f14_points').setValue(total, { emitEvent: false });
	}

	save(){

		this.submitAttempt = true;
		if (this.current.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.current.value;
			formData['fm_id']   = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('crop_current', formData)
				.map(res => res.json())
				.subscribe(data => {
					
				    loading.dismiss();
					if(data.success){		
						let callback = this.navParams.get("callback") || false;
		                if(callback){
		                    callback(true).then(()=>{
		                        this.navCtrl.pop();
		                    });
		                }else{
		                    this.navCtrl.pop();
		                }
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
				formData['id'] = this.id;

				this.api.put('crop_current', formData)
				.map(res => res.json())
				.subscribe(data => {

				    loading.dismiss();
				    if(data.success){		
						let callback = this.navParams.get("callback") || false;
		                if(callback){
		                    callback(true).then(()=>{
		                        this.navCtrl.pop();
		                    });
		                }else{
		                    this.navCtrl.pop();
		                }
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
			console.log('Validation error', this.current.controls);
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
