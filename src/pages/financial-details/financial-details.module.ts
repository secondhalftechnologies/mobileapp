import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialDetailsPage } from './financial-details';

@NgModule({
  declarations: [
    FinancialDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialDetailsPage),
  ],
})
export class FinancialDetailsPageModule {}
