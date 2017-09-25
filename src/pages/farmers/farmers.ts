import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Farmerdetail } from '../farmerdetail/farmerdetail';

@Component({
  selector: 'page-farmers',
  templateUrl: 'farmers.html'
})
export class FarmersPage {
  selectedItem: any;
  icons: string[];
  items: Array<{id:string, image:string, name: string, address: string, points: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeItems();
  }

  initializeItems(){
    this.items = [
      {id: '1', image: 'images.jpg', name: 'Ejaz Ansari', address:'203 isa heights, Molvi compound, Reti bandar rd. kalyan west', points:'20.50'},
      {id: '2', image: 'images.jpg', name: 'Prathamesh Acharekar', address:'heights, Molvi compound, Reti bandar rd. kalyan west', points:'2.90'},
      {id: '3', image: 'images.jpg', name: 'Punit Panchal', address:'Molvi compound, Reti bandar rd. kalyan west', points:'30.87'},
      {id: '4', image: 'images.jpg', name: 'Satish Dhere', address:'06 isa heights, Molvi compound, Reti bandar rd. kalyan west', points:'40.33'},
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    // val = val.trim();
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.address.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemTapped(event, farmer) {
    this.navCtrl.push(Farmerdetail, {
      farmer: farmer
    });
  }
}
