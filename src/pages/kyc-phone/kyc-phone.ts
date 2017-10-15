import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the KycPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-kyc-phone',
  templateUrl: 'kyc-phone.html',
})
export class KycPhonePage {

    phone: FormGroup;
	submitAttempt: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
		this.phone = formBuilder.group({
			'f5_points' : ['0'],

			'f5_phonetype' : ['', Validators.required],
			'f5_any_one_have_smart_phone' : ['', Validators.required],
			'f5_servpro' : [''],
			'f5_network' : [''],
			'f5_datapack' : [''],
			'f5_datapackname' : [''],
			'f5_appuse' : [''],
			'f5_app_name' : ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
			'f5_farmapp' : [''],
			
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad KycPhonePage');

		//update validation here
		this.setValidation();

		//Listen for form changes
		this.phone.controls['f5_phonetype'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal()
		});

		this.phone.controls['f5_any_one_have_smart_phone'].valueChanges.subscribe(() => {
			this.getTotal()
		});

		this.phone.controls['f5_datapack'].valueChanges.subscribe(() => {
			this.setValidation();
			this.getTotal()
		});

		this.phone.controls['f5_farmapp'].valueChanges.subscribe(() => {
			this.getTotal()
		});

		this.phone.controls['f5_appuse'].valueChanges.subscribe(() => {
			this.setValidation();
		});
	}

	setValidation(){
		let controls = this.phone.controls;
		if(controls['f5_phonetype'].value === 'smartphone'){

			controls['f5_datapack'].enable({ emitEvent: false });
			controls['f5_appuse'].enable({ emitEvent: false });
			controls['f5_app_name'].enable({ emitEvent: false });
			controls['f5_farmapp'].enable({ emitEvent: false });
		}
		else{
			controls['f5_datapack'].setValue('', { emitEvent: false });
			controls['f5_appuse'].setValue('', { emitEvent: false });
			controls['f5_app_name'].setValue('', { emitEvent: false });
			controls['f5_farmapp'].setValue('', { emitEvent: false });

			controls['f5_datapack'].disable({ emitEvent: false });
			controls['f5_appuse'].disable({ emitEvent: false });
			controls['f5_app_name'].disable({ emitEvent: false });
			controls['f5_farmapp'].disable({ emitEvent: false });
		}

		if(controls['f5_appuse'].value === 'yes'){
			controls['f5_app_name'].enable({ emitEvent: false });
		}
		else{
			controls['f5_app_name'].setValue('', { emitEvent: false });
			controls['f5_app_name'].disable({ emitEvent: false });
		}
	}

	getTotal(){
		let values = this.phone.getRawValue();
		let points = {};
		let total:number = 0;
		points['f5_phonetype']                = 0;
		points['f5_any_one_have_smart_phone'] = 0;
		points['f5_datapack']                 = 0;
		points['f5_farmapp']                  = 0;

		//setting points based on values
		//f5_phonetype
		switch (values['f5_phonetype']) {
			case "smartphone":
				points['f5_phonetype'] = 10;
				break;
			case "featurephone":
				points['f5_phonetype'] = 5;
				break;
		}

		//f5_any_one_have_smart_phone
		switch (values['f5_any_one_have_smart_phone']) {
			case "yes":
				points['f5_any_one_have_smart_phone'] = 10;
				break;
			case "no":
				points['f5_any_one_have_smart_phone'] = 0;
				break;
		}

		//f5_datapack
		switch (values['f5_datapack']) {
			case "yes":
				points['f5_datapack'] = 10;
				break;
			case "no":
				points['f5_datapack'] = 0;
				break;
		}

		//f5_farmapp
		switch (values['f5_farmapp']) {
			case "yes":
				points['f5_farmapp'] = 10;
				break;
			case "no":
				points['f5_farmapp'] = 0;
				break;
		}

		
		//sum of calculated points
		for(let point in points){
			total += Number(points[point]);
		}

		console.log(total);
		if(values['f5_phonetype'] == 'smartphone'){
			total = total/4;
		}else{
			total = total/2;
		}

		total = parseFloat(total.toFixed(2));
		this.phone.get('f5_points').setValue(total, { emitEvent: false });
	}

	save(){
		this.submitAttempt = true;
		if (this.phone.valid) {
			console.log(this.phone.value);
		}else{
			console.log('Validation error');
		}
	}

}
