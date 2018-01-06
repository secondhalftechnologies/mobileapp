import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
* Generated class for the FinancialHistoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
	selector: 'page-financial-history',
	templateUrl: 'financial-history.html',
})
export class FinancialHistoryPage {

	history: FormGroup;
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
		this.history = formBuilder.group({
			'f8_points' : ['0'],

			'f8_crop_insurance' : ['', Validators.required ],
			'f8_insurance_amount' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]) ],
			'f8_insurer_name' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],

			'f8_any_subsidies' : ['', Validators.required ],
			'f8_subsidy_name' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],

			'f8_any_loan_waivers' : ['', Validators.required ],
			'f8_waiver_name' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],
		});
		
		//Listen for form value changes
		this.history.controls.f8_crop_insurance.valueChanges.subscribe(() => {
			this.setValidation();
		});

		this.history.controls.f8_any_subsidies.valueChanges.subscribe(() => {
			this.setValidation();
		});

		this.history.controls.f8_any_loan_waivers.valueChanges.subscribe(() => {
			this.setValidation();
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad FinancialHistoryPage');
		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		//get data from server
		this.api.get('financial_history/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data[0] != undefined){
						this.addNew = false;
						let webData = data.data[0];
						for (let key in webData) {
							if(this.history.controls[key] != undefined){
								this.history.controls[key].setValue(webData[key]);
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
		let controls = this.history.controls;
		if(controls['f8_crop_insurance'].value === 'yes'){

			controls['f8_insurance_amount'].enable({ emitEvent: false });
			controls['f8_insurer_name'].enable({ emitEvent: false });
		}
		else{
			controls['f8_insurance_amount'].setValue('', { emitEvent: false });
			controls['f8_insurer_name'].setValue('', { emitEvent: false });

			controls['f8_insurance_amount'].disable({ emitEvent: false });
			controls['f8_insurer_name'].disable({ emitEvent: false });
		}

		if(controls['f8_any_subsidies'].value === 'yes'){

			controls['f8_subsidy_name'].enable({ emitEvent: false });
		}
		else{
			controls['f8_subsidy_name'].setValue('', { emitEvent: false });
			controls['f8_subsidy_name'].disable({ emitEvent: false });
		}

		if(controls['f8_any_loan_waivers'].value === 'yes'){

			controls['f8_waiver_name'].enable({ emitEvent: false });
		}
		else{
			controls['f8_waiver_name'].setValue('', { emitEvent: false });
			controls['f8_waiver_name'].disable({ emitEvent: false });
		}
	}

	getTotal(){}

	save(){

		this.submitAttempt = true;
		if (this.history.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.history.value;
			formData['fm_id'] = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('financial_history', formData)
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
				this.api.put('financial_history', formData)
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
			console.log('Validation error', this.history.controls);
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
