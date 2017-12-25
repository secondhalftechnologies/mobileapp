import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import 'rxjs/add/operator/map';

/**
 * Generated class for the CropCultivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crop-cultivation',
  templateUrl: 'crop-cultivation.html',
})
export class CropCultivationPage {

	crops : Array<any> = [];
	farmer_id: string;
	ca_id: string;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private loadingCtrl: LoadingController, 
				public toastCtrl: ToastController,
				private api: Api) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CropCultivationPage');

		this.crops = [];

		//set farmer_id and ca_id
		this.farmer_id = this.navParams.get('farmer_id') || 0;
		this.ca_id = this.navParams.get('ca_id') || 0;

		let loading = this.loadingCtrl.create({
		    content: 'Loading data...'
		});
		loading.present();

		//Get list of items from server
		this.api.get('crop_cultivation/'+ this.farmer_id)
		.map(res => res.json())
		.subscribe(
			data => {
				if(data.success){
					if(data.data != undefined){
						if(data.data.length > 0){
							for(let item of data.data){
								this.crops.push(item);
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

	addnew(){
		// callback...
		let _that = this;
		let myCallbackFunction = function(_params) {
			return new Promise((resolve, reject) => {
				console.log(_params);
				if(_params){
					_that.ionViewDidLoad();
				}
				resolve();
			});
		}

		this.navCtrl.push('CropCultivationAddPage', {
			farmer_id : this.farmer_id,
			ca_id : this.ca_id,
			callback: myCallbackFunction
		});
	}

	itemTapped(event, item){
		// callback...
		let _that = this;
		let myCallbackFunction = function(_params) {
			return new Promise((resolve, reject) => {
				console.log(_params);
				if(_params){
					_that.ionViewDidLoad();
				}
				resolve();
			});
		}

		this.navCtrl.push('CropCultivationAddPage', {
			farmer_id : this.farmer_id,
			ca_id : this.ca_id,
			id : item.id,
			callback: myCallbackFunction
		});
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
