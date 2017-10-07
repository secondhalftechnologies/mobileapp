import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the AddFarmerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-farmer',
  templateUrl: 'add-farmer.html',
})
export class AddFarmerPage {

  slideOneForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
  	this.slideOneForm = formBuilder.group({
        fullname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        fathername: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        mothername: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        dob: ['', Validators.required],
        mobile: ['', Validators.compose([Validators.pattern('^[0-9]{10}$'), Validators.required])],
        altmobile: ['', Validators.compose([Validators.pattern('^[0-9]{10}$')])],
        aadhaar: ['', Validators.compose([Validators.pattern('^[0-9]{12}$'), Validators.required])],
        experience: ['', Validators.compose([Validators.pattern('^[0-9.]{5}$'), Validators.required])],
        married: ['', Validators.required],
        residence: ['', Validators.required],
        
        phouse: ['', Validators.required],
        pstreet: ['', Validators.required],
        parea: ['', Validators.required],
        pstate: ['', Validators.required],
        pdistrict: ['', Validators.required],
        ptaluka: ['', Validators.required],
        pvillage: ['', Validators.required],
        ppin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],
        
        chouse: ['', Validators.required],
        cstreet: ['', Validators.required],
        carea: ['', Validators.required],
        cstate: ['', Validators.required],
        cdistrict: ['', Validators.required],
        ctaluka: ['', Validators.required],
        cvillage: ['', Validators.required],
        cpin: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFarmerPage');
  }

	save(){

		this.submitAttempt = true;
		console.log(this.slideOneForm.controls.fullname.errors);
	    console.log(this.slideOneForm.value);
		if(!this.slideOneForm.valid){
		    
		}
		else {
		    console.log("success!")
		    console.log(this.slideOneForm.value);
		}
	}

	copyAddress(){
		this.slideOneForm.controls['chouse'].setValue(this.slideOneForm.value.phouse);
		this.slideOneForm.controls['cstreet'].setValue(this.slideOneForm.value.pstreet);
		this.slideOneForm.controls['carea'].setValue(this.slideOneForm.value.parea);
		this.slideOneForm.controls['cstate'].setValue(this.slideOneForm.value.pstate);
		this.slideOneForm.controls['cdistrict'].setValue(this.slideOneForm.value.pdistrict);
		this.slideOneForm.controls['ctaluka'].setValue(this.slideOneForm.value.ptaluka);
		this.slideOneForm.controls['cvillage'].setValue(this.slideOneForm.value.pvillage);
		this.slideOneForm.controls['cpin'].setValue(this.slideOneForm.value.ppin);
		console.log(this.slideOneForm.value);
	}
}
