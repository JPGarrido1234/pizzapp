import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PopupHolidaysPageRoutingModule } from './popupholidays-routing.module';

import { PopupHolidaysPage } from './popupholidays.page';


const routes: Routes = [
  {
    path: '',
    component: PopupHolidaysPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupHolidaysPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopupHolidaysPage]
})
export class PopupHolidaysPageModule {}
