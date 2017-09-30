import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';

interface point<T> {
    [K: string]: T;
}

@IonicPage()
@Component({
  selector: 'page-forms',
  templateUrl: 'forms.html'
})


export class Forms {

	current_farmer: {id:string, image:string, name: string, address: string, points: string};
	form_name: string;
	points: point<string>;

	constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController){
		this.current_farmer = navParams.get('farmer');
		this.getFarmerPoints(this.current_farmer.id);
		this.form_name = navParams.get('form_name');
				
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
}
