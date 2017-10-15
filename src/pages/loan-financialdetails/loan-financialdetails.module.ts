import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanFinancialdetailsPage } from './loan-financialdetails';

@NgModule({
  declarations: [
    LoanFinancialdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanFinancialdetailsPage),
  ],
})
export class LoanFinancialdetailsPageModule {}
