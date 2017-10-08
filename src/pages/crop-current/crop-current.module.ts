import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropCurrentPage } from './crop-current';

@NgModule({
  declarations: [
    CropCurrentPage,
  ],
  imports: [
    IonicPageModule.forChild(CropCurrentPage),
  ],
})
export class CropCurrentPageModule {}
