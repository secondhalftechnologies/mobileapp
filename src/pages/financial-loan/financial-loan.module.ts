import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialLoanPage } from './financial-loan';

@NgModule({
  declarations: [
    FinancialLoanPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialLoanPage),
  ],
})
export class FinancialLoanPageModule {}
