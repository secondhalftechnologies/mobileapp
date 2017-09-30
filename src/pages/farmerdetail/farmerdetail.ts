import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';


interface point<T> {
    [K: string]: T;
}

@IonicPage()
@Component({
  selector: 'page-farmerdetail',
  templateUrl: 'farmerdetail.html'
})


export class Farmerdetail {

	current_farmer: {id:string, image:string, name: string, address: string, points: string};
	points: point<string>;

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController){
		this.current_farmer = navParams.get('farmer');
		this.getFarmerPoints(this.current_farmer.id);
		
		let loading = this.presentLoading('Please wait...');
		loading.present();
		setTimeout(() => {
		    loading.dismiss();
		}, 1000);
	}

	getFarmerPoints(id: string){
		//some http work here
		this.points = {
			'item1' : '10',
			'item2' : '20',
			'item3' : '30',
			'item4' : '40',
			'item5' : '50',
		};
	}

	presentLoading(text: string) {
	  let loading = this.loadingCtrl.create({
	    content: text
	  });

	  return loading;
	}

	showForm(name:string){
		this.navCtrl.push('Forms', {
	      farmer: this.current_farmer,
	      form_name : name
	    });
	}
}
