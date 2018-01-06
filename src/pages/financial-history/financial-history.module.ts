import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialHistoryPage } from './financial-history';

@NgModule({
  declarations: [
    FinancialHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialHistoryPage),
  ],
})
export class FinancialHistoryPageModule {}
