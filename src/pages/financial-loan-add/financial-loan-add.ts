import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
	selector: 'page-financial-loan-add',
	templateUrl: 'financial-loan-add.html',
})
export class FinancialLoanAddPage {

	loan: FormGroup;
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
		this.loan = formBuilder.group({
			'f8_points' : ['0'],

			'f8_loan_type' : ['', Validators.required],
			'f8_loan_amount' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]) ],
			'f8_loan_provider' : ['', Validators.compose([ Validators.required, Validators.maxLength(50)]) ],
		});

		//Listen for form changes
		this.loan.controls['f8_loan_type'].valueChanges.subscribe(() => {
			this.getTotal();
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad FinancialLoanAddPage');
		
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
			this.api.get('loans/'+ this.id)
			.map(res => res.json())
			.subscribe(
				data => {
					if(data.success){
						if(data.data[0] != undefined){
							this.addNew = false;
							let webData = data.data[0];
							for (let key in webData) {
								if(this.loan.controls[key] != undefined){
									this.loan.controls[key].setValue(webData[key]);
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
	}

	save(){

		this.submitAttempt = true;
		if (this.loan.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.loan.value;
			formData['fm_id']   = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('loans', formData)
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

				this.api.put('loans', formData)
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
			console.log('Validation error', this.loan.controls);
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
