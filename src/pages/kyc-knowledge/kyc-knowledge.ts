import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
	submitAttempt: boolean = false;
	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private loadingCtrl: LoadingController) {
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
	}

	ionViewDidLoad() {
		// let loading = this.loadingCtrl.create({
		//     content: 'Loading data...'
		// });
		// loading.present();
		// console.log('ionViewDidLoad KycKnowledgePage', this.knowledge);
		// setTimeout(() => {
		//     loading.dismiss();
		// }, 1000);
		
		//update validation here
		this.setValidation();

		//Listen for form changes
		this.knowledge.controls['f2_edudetail'].valueChanges.subscribe(() => {this.getTotal();});
		this.knowledge.controls['f2_proficiency'].valueChanges.subscribe(() => {this.getTotal();});
		this.knowledge.controls['f2_participation'].valueChanges.subscribe(() => {this.getTotal();});
	}

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

	save(){
		this.submitAttempt = true;
		if (this.knowledge.valid) {
			console.log(this.knowledge.value);
		}else{
			console.log('Validation error', this.knowledge.controls);
		}
	}
}
