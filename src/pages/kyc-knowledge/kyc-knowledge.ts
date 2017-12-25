import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the KycKnowledgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-knowledge',
  templateUrl: 'kyc-knowledge.html',
})
export class KycKnowledgePage {

	knowledge: FormGroup;
	farmer_id: string;
	ca_id: string;
	submitAttempt: boolean = false;
	retryButton: boolean   = false;
	addNew: boolean        = true;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public formBuilder: FormBuilder, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
				private api: Api) {


		//creating form via formbuilder 
		this.knowledge = formBuilder.group({
			'f2_points' : ['0'],

			'f2_edudetail' : ['', Validators.required], //drp
			'f2_proficiency' : ['', Validators.required], //drp
			'f2_participation' : [''], //drp
			'f2_typeprog' : ['', Validators.required], //drp
			'f2_durprog' : ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+$')]) ],
			'f2_condprog' : ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]) ],
			'f2_cropprog' : ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]) ],
		});

		//update validation here
		this.setValidation();

		//Listen for form changes
		this.knowledge.controls['f2_edudetail'].valueChanges.subscribe(() => {this.getTotal(); this.setValidation();});
		this.knowledge.controls['f2_proficiency'].valueChanges.subscribe(() => {this.getTotal(); this.setValidation();});
		this.knowledge.controls['f2_participation'].valueChanges.subscribe(() => {this.getTotal(); this.setValidation();});
	}

	ionViewDidEnter() {

		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		this.retryButton = false;
		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();
		
		//get data from server
		this.api.get('kyc_knowledge/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data[0] != undefined){
						this.addNew = false;
						let webData = data.data[0];
						for (let key in webData) {
							if(this.knowledge.controls[key] != undefined){
								this.knowledge.controls[key].setValue(webData[key]);
							}
						}
					}
				}
				else{
					this.retryButton = true;
				}

				loading.dismiss();
				// this.showMessage("All * marked fields are mandatory!", "black");
			}, 
			err => {
				console.log(err);
				setTimeout(() => {
				    loading.dismiss();
					this.retryButton = true;
					this.showMessage("Something went wrong, make sure that Internet connection is on!", "danger");
				}, 1000);
			}
		);

	}

	//validation function
	setValidation(){
		let controls = this.knowledge.controls;
		if(controls['f2_participation'].value == 'yes'){
			controls['f2_typeprog'].enable();
			controls['f2_durprog' ].enable();
			controls['f2_condprog'].enable();
			controls['f2_cropprog'].enable();
		}
		else{
			controls['f2_typeprog'].disable();
			controls['f2_durprog' ].disable();
			controls['f2_condprog'].disable();
			controls['f2_cropprog'].disable();
		}
	}

	//point calculations
	getTotal(){

		let values = this.knowledge.getRawValue();
		let points = {};
		let total:number = 0;
		points['f2_edudetail']     = 0;
		points['f2_proficiency']   = 0;
		points['f2_participation'] = 0;

		//setting points based on values
		//f2_edudetail
		switch (values['f2_edudetail']) {
			case "illiterate":
				points['f2_edudetail'] = 2;
				break;
			case "primary education":
				points['f2_edudetail'] = 4;
				break;
			case "matriculate":
				points['f2_edudetail'] = 6;
				break;
			case "graduate":
				points['f2_edudetail'] = 8;
				break;
			case "post graduate":
				points['f2_edudetail'] = 10;
				break;
		}

		//f2_proficiency
		switch (values['f2_proficiency']) {
			case "read write":
				points['f2_proficiency'] = 10;
				break;
			case "read only":
				points['f2_proficiency'] = 5;
				break;
			case "understand only":
				points['f2_proficiency'] = 0;
				break;
		}

		//f2_participation
		switch (values['f2_participation']) {
			case "yes":
				points['f2_participation'] = 10;
				break;
			case "no":
				points['f2_participation'] = 0;
				break;
		}

		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		total = parseFloat((total/3).toFixed(2));
		this.knowledge.get('f2_points').setValue(total, { emitEvent: false });
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

	//on save(check-mark) button click
	save(){

		this.submitAttempt = true;
		if (this.knowledge.valid) {

			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			});
			loading.present();
			
			console.log('is POST ', this.addNew);

			let formData = this.knowledge.value;
			formData['fm_id'] = this.farmer_id;
			formData['fm_caid'] = this.ca_id;
			console.log(formData);

			if(this.addNew){
				//do post request
				this.api.post('kyc_knowledge', formData)
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
				this.api.put('kyc_knowledge', formData)
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
			console.log('Validation error', this.knowledge.controls);
			this.showMessage("Please fill valid data!", "danger", 100000);
		}
	}
}
