import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the KycAppliancesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-appliances',
  templateUrl: 'kyc-appliances.html',
})
export class KycAppliancesPage {

    appliances: FormGroup;
    numbers: Array<number> = Array(11).fill(0).map((x,i)=>i); 
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
		this.appliances = formBuilder.group({
			'f7_points' : ['0'],

			'f7_television' : ['', Validators.required],
			'f7_refrigerator' : ['', Validators.required],
			'f7_wmachine' : ['', Validators.required],
			'f7_mixer' : ['', Validators.required],
			'f7_stove' : ['', Validators.required],
			'f7_bicycle' : ['', Validators.required],
			'f7_ccylinder' : ['', Validators.required],
			'f7_fans' : ['', Validators.required],
			'f7_motorcycle' : ['', Validators.required],
			'f7_car' : ['', Validators.required],
		});

		//Listen for form value changes
		this.appliances.valueChanges.subscribe(()=>{
			this.getTotal();
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad KycappliancesPage');
		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		//get data from server
		this.api.get('kyc_appliances/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data[0] != undefined){
						this.addNew = false;
						let webData = data.data[0];
						for (let key in webData) {
							if(this.appliances.controls[key] != undefined){
								this.appliances.controls[key].setValue(webData[key]);
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

	getTotal(){
		let values = this.appliances.getRawValue();
		let points = {};
		let total:number = 0;
		points['f7_television']   = values['f7_television'] ? 4 : 0;
		points['f7_refrigerator'] = values['f7_refrigerator'] ? 4 : 0;
		points['f7_wmachine']     = values['f7_wmachine'] ? 4 : 0;
		points['f7_mixer']        = values['f7_mixer'] ? 4 : 0;
		points['f7_stove']        = values['f7_stove'] ? 4 : 0;
		points['f7_bicycle']      = values['f7_bicycle'] ? 4 : 0;
		points['f7_ccylinder']    = values['f7_ccylinder'] ? 4 : 0;
		points['f7_fans']         = values['f7_fans'] ? 4 : 0;
		points['f7_motorcycle']   = values['f7_motorcycle'] ? 8 : 0;
		points['f7_car']          = values['f7_car'] ? 10 : 0;

		
		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);

		total = parseFloat((total/10).toFixed(2));
		this.appliances.get('f7_points').setValue(total, { emitEvent: false });
	}

	save(){

		this.submitAttempt = true;
		if (this.appliances.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.appliances.value;
			formData['fm_id'] = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('kyc_appliances', formData)
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
				this.api.put('kyc_appliances', formData)
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
			console.log('Validation error', this.appliances.controls);
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
