import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Farmerdetail } from './farmerdetail';

@NgModule({
  declarations: [
    Farmerdetail,
  ],
  imports: [
    IonicPageModule.forChild(Farmerdetail),
  ],
  exports: [
    Farmerdetail
  ]
})
export class FarmerdetailModule { }