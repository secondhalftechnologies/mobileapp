import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the LandFarmAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-land-farm-add',
  templateUrl: 'land-farm-add.html',
})
export class LandFarmAddPage {

    land: FormGroup;
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
		this.land = formBuilder.group({
			'f9_points' : ['0'],

			'f9_land_size' : ['', Validators.compose([ Validators.required, Validators.maxLength(6), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_owner' : ['', Validators.required],
			'f9_lease_year' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_amount_on_rent' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_contract_year' : ['', Validators.compose([ Validators.required, Validators.maxLength(10), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_state' : ['', Validators.required],
			'f9_district' : ['', Validators.required],
			'f9_taluka' : ['', Validators.required],
			'f9_vilage' : ['', Validators.required],
			'f9_survey_number' : ['', Validators.compose([ Validators.required, Validators.maxLength(10)]) ],
			'f9_pincode' : ['', Validators.compose([ Validators.required, Validators.pattern('^[0-9]{6}$')])],
			'f9_lat' : ['', Validators.required],
			'f9_long' : ['', Validators.required],
			'f9_soil_type' : ['', Validators.required],
			'f9_soil_tested' : ['', Validators.required],
			'f9_soil_depth' : ['', Validators.compose([ Validators.required, Validators.maxLength(6), Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')]) ],
			'f9_source_of_water' : ['', Validators.required],
		});
		
		//Listen for form changes
		this.land.controls['f9_land_size'].valueChanges.subscribe(() => {
			this.getTotal()
		});
		this.land.controls['f9_owner'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal()
		});
		this.land.controls['f9_soil_type'].valueChanges.subscribe(() => {
			this.getTotal()
		});
		this.land.controls['f9_soil_tested'].valueChanges.subscribe(() => {
			this.getTotal()
		});
		this.land.controls['f9_source_of_water'].valueChanges.subscribe(() => {
			this.getTotal()
		});
	}

	setValidation(){
		let controls = this.land.controls;

		if(controls['f9_owner'].value === 'Rented'){
			controls['f9_amount_on_rent'].enable({ emitEvent: false });
		}
		else{
			controls['f9_amount_on_rent'].setValue('', { emitEvent: false });
			controls['f9_amount_on_rent'].disable({ emitEvent: false });
		}

		if(controls['f9_owner'].value === 'Contracted'){
			controls['f9_contract_year'].enable({ emitEvent: false });
		}
		else{
			controls['f9_contract_year'].setValue('', { emitEvent: false });
			controls['f9_contract_year'].disable({ emitEvent: false });
		}

		if(controls['f9_owner'].value === 'Leased'){
			controls['f9_lease_year'].enable({ emitEvent: false });
		}
		else{
			controls['f9_lease_year'].setValue('', { emitEvent: false });
			controls['f9_lease_year'].disable({ emitEvent: false });
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
			this.api.get('land_farms/'+ this.id)
			.map(res => res.json())
			.subscribe(
				data => {
					if(data.success){
						if(data.data[0] != undefined){
							this.addNew = false;
							let webData = data.data[0];
							for (let key in webData) {
								if(this.land.controls[key] != undefined){
									this.land.controls[key].setValue(webData[key]);
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
		let values = this.land.getRawValue();
		let points = {};
		let total:number = 0;
		points['f9_land_size']       = 0;
		points['f9_owner']           = 0;
		points['f9_soil_type']       = 0;
		points['f9_soil_tested']     = 0;
		points['f9_source_of_water'] = 0;

		//setting points based on values
		//f9_land_size
		switch (true) {
			case values['f9_land_size'] >= 0 && values['f9_land_size'] <= 3:
				points['f9_land_size'] = 5;
				break;
			case values['f9_land_size'] >= 4 && values['f9_land_size'] <= 6:
				points['f9_land_size'] = 7;
				break;
			case values['f9_land_size'] >= 7 && values['f9_land_size'] <= 10:
				points['f9_land_size'] = 8;
				break;
			case values['f9_land_size'] >= 11 && values['f9_land_size'] <= 15:
				points['f9_land_size'] = 9;
				break;
			case values['f9_land_size'] >= 16 && values['f9_land_size'] <= 20:
				points['f9_land_size'] = 10;
				break;
			case values['f9_land_size'] > 21:
				points['f9_land_size'] = 10;
				break;
		}
		console.log('Size', points['f9_land_size']);
		//f9_owner
		switch (values['f9_owner']) {
			case "Owned":
				points['f9_owner'] = 10;
				break;
			case "Ancestral":
				points['f9_owner'] = 5;
				break;
			case "Rented":
				points['f9_owner'] = 5;
				break;
			case "Contracted":
				points['f9_owner'] = 5;
				break;
			case "Leased":
				points['f9_owner'] = 3;
				break;
		}
		console.log('Owner', points['f9_owner']);

		//f9_soil_type
		switch (values['f9_soil_type']) {
			case "Alluvial Soil":
				points['f9_soil_type'] = 10;
				break;
			case "Black Soil":
				points['f9_soil_type'] = 9;
				break;
			case "Red Soil":
				points['f9_soil_type'] = 8;
				break;
			case "Mountain Soil":
				points['f9_soil_type'] = 6;
				break;
			case "Peat":
				points['f9_soil_type'] = 5;
				break;
			case "Laterite Soil":
				points['f9_soil_type'] = 5;
				break;
			case "Desert Soil":
				points['f9_soil_type'] = 2;
				break;
		}
		console.log('Soil Type', points['f9_soil_type']);

		//f9_soil_tested
		switch (values['f9_soil_tested']) {
			case "yes":
				points['f9_soil_tested'] = 10;
				break;
			case "no":
				points['f9_soil_tested'] = 0;
				break;
		}

		console.log('Soil tested', points['f9_soil_tested']);

		//f9_source_of_water
		switch (values['f9_source_of_water']) {
			case "Well Water":
				points['f9_source_of_water'] = 5;
				break;
			case "Tube Water":
				points['f9_source_of_water'] = 7;
				break;
			case "Tank Water":
				points['f9_source_of_water'] = 5;
				break;
			case "Canals":
				points['f9_source_of_water'] = 5;
				break;
			case "Perennial Water":
				points['f9_source_of_water'] = 5;
				break;
			case "Multipurpose River":
				points['f9_source_of_water'] = 5;
				break;
			case "Rain Fed":
				points['f9_source_of_water'] = 4;
				break;
			case "Drip Irrigation":
				points['f9_source_of_water'] = 8;
				break;
			case "Sprinkler":
				points['f9_source_of_water'] = 7;
				break;
			case "Furrow":
				points['f9_source_of_water'] = 3;
				break;
			case "Ditch":
				points['f9_source_of_water'] = 3;
				break;
			case "Surge":
				points['f9_source_of_water'] = 3;
				break;
			case "Seepage":
				points['f9_source_of_water'] = 3;
				break;
		}
		console.log('Water', points['f9_source_of_water']);
		
		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		total = parseFloat((total/5).toFixed(2));
		this.land.get('f9_points').setValue(total, { emitEvent: false });
	}

	save(){

		this.submitAttempt = true;
		if (this.land.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.land.value;
			formData['fm_id']   = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('land_farms', formData)
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

				this.api.put('land_farms', formData)
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
			console.log('Validation error', this.land.controls);
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
