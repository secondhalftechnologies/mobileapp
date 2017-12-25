import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the CropPreviousAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-previous-add',
  templateUrl: 'crop-previous-add.html',
})
export class CropPreviousAddPage {

  	previous: FormGroup;
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
		this.previous = formBuilder.group({
			'f11_points' : ['0'],

			'f11_cultivating' : ['', Validators.required],
			'f11_achieved' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f11_income' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f11_diseases' : ['', Validators.required],
			'f11_fertilizers' : ['', Validators.required],
			'f11_consumption_fertilizer' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f11_damaged_prev_crop' : ['', Validators.required],
			'f11_what_was_the_reason1' : ['', Validators.required],
		});
		
		//Listen for form changes
		this.previous.controls['f11_income'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.previous.controls['f11_diseases'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.previous.controls['f11_fertilizers'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.previous.controls['f11_damaged_prev_crop'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal();
		});
	}

	ionViewDidLoad() {
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
			this.api.get('crop_previous/'+ this.id)
			.map(res => res.json())
			.subscribe(
				data => {
					if(data.success){
						if(data.data[0] != undefined){
							this.addNew = false;
							let webData = data.data[0];
							for (let key in webData) {
								if(this.previous.controls[key] != undefined){
									this.previous.controls[key].setValue(webData[key]);
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

	setValidation(){
		let controls = this.previous.controls;
		if(controls['f11_damaged_prev_crop'].value == 'yes'){
			controls['f11_what_was_the_reason1'].enable();
		}
		else{
			controls['f11_what_was_the_reason1'].disable();
		}
	}

	getTotal(){
		let values = this.previous.getRawValue();
		let points = {};
		let total:number = 0;
		points['f11_income']            = 0;
		points['f11_diseases']          = 0;
		points['f11_fertilizers']       = 0;
		points['f11_damaged_prev_crop'] = 0;


		//setting points based on values
		//f11_income
		switch (true) {
			case values['f11_income'] >= 1 && values['f11_income'] <= 2500:
				points['f11_income'] = 4;
				break;
			case values['f11_income'] >= 2501 && values['f11_income'] <= 5000:
				points['f11_income'] = 6;
				break;
			case values['f11_income'] >= 5001 && values['f11_income'] <= 10000:
				points['f11_income'] = 7;
				break;
			case values['f11_income'] >= 10001 && values['f11_income'] <= 25000:
				points['f11_income'] = 8;
				break;
			case values['f11_income'] >= 25001 && values['f11_income'] <= 50000:
				points['f11_income'] = 9;
				break;
			case values['f11_income'] > 50000:
				points['f11_income'] = 10;
				break;
		}

		//f11_diseases
		switch (values['f11_diseases']) {
			case "yes":
				points['f11_diseases'] = 0;
				break;
			case "no":
				points['f11_diseases'] = 10;
				break;
		}

		//f11_fertilizers
		switch (values['f11_fertilizers']) {
			case "Organic Fertilizers":
				points['f11_fertilizers'] = 10;
				break;
			case "Inorganic Fertilizers":
				points['f11_fertilizers'] = 5;
				break;
		}

		//f11_damaged_prev_crop
		switch (values['f11_damaged_prev_crop']) {
			case "yes":
				points['f11_damaged_prev_crop'] = 0;
				break;
			case "no":
				points['f11_damaged_prev_crop'] = 10;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		total = parseFloat((total/3).toFixed(2));
		this.previous.get('f11_points').setValue(total, { emitEvent: false });
	}


	save(){

		this.submitAttempt = true;
		if (this.previous.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.previous.value;
			formData['fm_id']   = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('crop_previous', formData)
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

				this.api.put('crop_previous', formData)
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
			console.log('Validation error', this.previous.controls);
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
