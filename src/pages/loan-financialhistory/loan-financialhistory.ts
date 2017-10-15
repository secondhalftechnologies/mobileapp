import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the LoanFinancialhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loan-financialhistory',
  templateUrl: 'loan-financialhistory.html',
})
export class LoanFinancialhistoryPage {

	Loanliability: FormGroup;
	submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private loadingCtrl: LoadingController) {
  this.Loanliability = formBuilder.group({
  	'f15_points' : ['0'],

  	'f15_borrowfrom' : ['', Validators.required],
	'f15_prevclaim' : ['', Validators.required],
	'f15_reasonclaim' : ['', Validators.required],
	'f15_otherinsurane' : ['', Validators.required],
	'f15_subsidies' : ['', Validators.required],
	'f15_waivers' : ['', Validators.required],
	
  });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanFinancialhistoryPage');
  }

}
