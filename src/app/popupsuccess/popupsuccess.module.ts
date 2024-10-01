import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PopupSuccessPageRoutingModule } from './popupsuccess-routing.module';

import { PopupSuccessPage } from './popupsuccess.page';


const routes: Routes = [
  {
    path: '',
    component: PopupSuccessPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupSuccessPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopupSuccessPage]
})
export class PopupSuccessPageModule {}
