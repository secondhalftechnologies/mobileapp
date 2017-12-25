import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';
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

    personal: FormGroup;
    submitAttempt: boolean = false;
    retryButton: boolean = false;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                private loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                private api: Api,
                public formBuilder: FormBuilder) {

        this.personal = formBuilder.group({
            txt_name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            txt_father_name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            txt_mother_name: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
            txt_dob: ['', Validators.required],
            txt_age: ['', Validators.required],
            fm_mobileno: ['', Validators.compose([Validators.pattern('^[0-9]{10}$'), Validators.required])],
            alt_mobileno: ['', Validators.compose([Validators.pattern('^[0-9]{10}$')])],
            fm_aadhar: ['', Validators.compose([Validators.pattern('^[0-9]{12}$'), Validators.required])],
            txt_farm_experience: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[0-9.]+$'), Validators.required])],

            f1_required_loan: ['', Validators.required],
            f1_required_loan_amt: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[0-9.]+$'), Validators.required])],
            f1_loan_purpose: ['', Validators.required],
            f1_crop_cycle: ['', Validators.required],

            ddl_married_status: ['', Validators.required],
            ddl_residence_status: ['', Validators.required],
            txt_rent: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[0-9.]+$'), Validators.required])],

            txt_p_house_no: ['', Validators.required],
            txt_p_street_name: ['', Validators.required],
            txt_p_area_name: ['', Validators.required],
            ddl_p_state: ['', Validators.required],
            ddl_p_dist: ['', Validators.required],
            ddl_p_tal: ['', Validators.required],
            ddl_p_village: ['', Validators.required],
            txt_p_pincode: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],

            txt_c_house_no: ['', Validators.required],
            txt_c_street_name: ['', Validators.required],
            txt_c_area_name: ['', Validators.required],
            ddl_c_state: ['', Validators.required],
            ddl_c_dist: ['', Validators.required],
            ddl_c_tal: ['', Validators.required],
            ddl_c_village: ['', Validators.required],
            txt_c_pincode: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.required])],
        });

        //Listen for form changes
        this.personal.controls['f1_required_loan'].valueChanges.subscribe(() => {this.setValidation();});
        this.personal.controls['ddl_residence_status'].valueChanges.subscribe(() => {this.setValidation();});
        this.personal.controls.txt_dob.valueChanges.subscribe(() => {
            let dob = this.personal.controls.txt_dob.value;
            this.personal.controls.txt_age.setValue(this.getAge(dob));
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddFarmerPage');
        this.setValidation();
    }

    setValidation() {
        let controls = this.personal.controls;
        if (controls['f1_required_loan'].value == 'yes') {
            controls['f1_required_loan_amt'].enable();
            controls['f1_loan_purpose'].enable();
            controls['f1_crop_cycle'].enable();
        } else {
            controls['f1_required_loan_amt'].disable();
            controls['f1_loan_purpose'].disable();
            controls['f1_crop_cycle'].disable();

            controls['f1_required_loan_amt'].setValue('', { emitEvent: false });
            controls['f1_loan_purpose'].setValue('', { emitEvent: false });
            controls['f1_crop_cycle'].setValue('', { emitEvent: false });
        }
        
        if (controls['ddl_residence_status'].value == 'Rented') {
            controls['txt_rent'].enable();
        } else {
            controls['txt_rent'].disable();
            controls['txt_rent'].setValue('', { emitEvent: false });
        }
    }

    save() {

        this.submitAttempt = true;
        if (!this.personal.valid) {
            this.showMessage("Please fill all mandatory data", "danger");
        } else {

            let loading = this.loadingCtrl.create({
                content: 'Please wait...'
            });
            loading.present();

            console.log("success!")
            console.log(this.personal.value);
            //do post request
            this.api.post('farmer', this.personal.value)
            .map(res => res.json())
            .subscribe(data => {
                
                if(data.success){        
                    this.showMessage("Added successfully!", "success");
                }
                loading.dismiss();
                this.navCtrl.pop();

            }, err => {
                console.log(err);
                this.showMessage("Faild to add, please try again!", "danger");
                loading.dismiss();
            });
        }
    }

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

    copyAddress() {
        this.personal.controls['txt_c_house_no'].setValue(this.personal.value.txt_p_house_no);
        this.personal.controls['txt_c_street_name'].setValue(this.personal.value.txt_p_street_name);
        this.personal.controls['txt_c_area_name'].setValue(this.personal.value.txt_p_area_name);
        this.personal.controls['ddl_c_state'].setValue(this.personal.value.ddl_p_state);
        this.personal.controls['ddl_c_dist'].setValue(this.personal.value.ddl_p_dist);
        this.personal.controls['ddl_c_tal'].setValue(this.personal.value.ddl_p_tal);
        this.personal.controls['ddl_c_village'].setValue(this.personal.value.ddl_p_village);
        this.personal.controls['txt_c_pincode'].setValue(this.personal.value.txt_p_pincode);
        console.log(this.personal.value);
    }

    getAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
