import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

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
		
		//Listen for form changes
		this.cultivation.controls['f10_stage'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.cultivation.controls['f10_expected'].valueChanges.subscribe(() => {
			this.getTotal();
		});
		this.cultivation.controls['f10_filt_type'].valueChanges.subscribe(() => {
			this.getTotal();
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad cultivationFarmAddPage');

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
			this.api.get('crop_cultivation/'+ this.id)
			.map(res => res.json())
			.subscribe(
				data => {
					if(data.success){
						if(data.data[0] != undefined){
							this.addNew = false;
							let webData = data.data[0];
							for (let key in webData) {
								if(this.cultivation.controls[key] != undefined){
									this.cultivation.controls[key].setValue(webData[key]);
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

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.cultivation.value;
			formData['fm_id']   = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('crop_cultivation', formData)
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

				this.api.put('crop_cultivation', formData)
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
			console.log('Validation error', this.cultivation.controls);
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
