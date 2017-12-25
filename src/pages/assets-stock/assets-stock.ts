import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the AssetsStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assets-stock',
  templateUrl: 'assets-stock.html',
})
export class AssetsStockPage {

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
			'f13_points' : ['0'],

			'f13_dairy_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_draft_cattle' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_buffalo' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_ox' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_sheep' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_goat' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_pig' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_poultry' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
			'f13_donkeys' : ['', Validators.compose([ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+$')]) ],
		});
		
		//Listen for form value changes
		this.assets.valueChanges.subscribe(() => {
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
		this.api.get('assets_stock/'+ this.farmer_id)
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

	getTotal(){
		let values = this.assets.getRawValue();
		let total:number = 0;
		let points:number = 0;
		
		
		for( let val in values){
			if(values[val]){
				points += parseInt(values[val]);
				console.log(points);
			}
		}

		switch (true) {
			case (points >= 0 && points <= 50):
				total = 4;
				break;
			case (points >= 51 && points <= 100):
				total = 6;
				break;
			case (points >= 101 && points <= 150):
				total = 10;
				break;
		}

		console.log(points);
		console.log(total);
		total = parseFloat((total).toFixed(2));

		this.assets.get('f13_points').setValue(total, { emitEvent: false });
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
				this.api.post('assets_stock', formData)
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
				this.api.put('assets_stock', formData)
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
