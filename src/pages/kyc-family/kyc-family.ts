import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';
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
		this.family = formBuilder.group({
			'f6_points' : ['0'],

			'f6_jointfamily' : ['', Validators.required],
			'f6_members' : ['', Validators.required],
			'f6_children' : ['', Validators.required],
			'f6_smartuse' : ['', Validators.required],
		});
		
		//Listen for form changes
		this.family.valueChanges.subscribe(() => {
			this.getTotal()
		});
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad KycfamilyPage');
		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		//get data from server
		this.api.get('kyc_family/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data[0] != undefined){
						this.addNew = false;
						let webData = data.data[0];
						for (let key in webData) {
							if(this.family.controls[key] != undefined){
								this.family.controls[key].setValue(webData[key]);
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

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.family.value;
			formData['fm_id'] = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('kyc_family', formData)
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
				this.api.put('kyc_family', formData)
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
			console.log('Validation error', this.family.controls);
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
