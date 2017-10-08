import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CropCurrentAddPage } from './crop-current-add';

@NgModule({
  declarations: [
    CropCurrentAddPage,
  ],
  imports: [
    IonicPageModule.forChild(CropCurrentAddPage),
  ],
})
export class CropCurrentAddPageModule {}
