import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialLoanAddPage } from './financial-loan-add';

@NgModule({
  declarations: [
    FinancialLoanAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialLoanAddPage),
  ],
})
export class FinancialLoanAddPageModule {}
