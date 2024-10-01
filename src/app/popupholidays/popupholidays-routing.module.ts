import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupHolidaysPage } from './popupholidays.page';


const routes: Routes = [
  {
    path: 'popupholidays',
    component: PopupHolidaysPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class PopupHolidaysPageRoutingModule {}
