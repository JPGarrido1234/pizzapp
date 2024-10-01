import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PopupPageRoutingModule } from './popup-routing.module';

import { PopupPage } from './popup.page';


const routes: Routes = [
  {
    path: '',
    component: PopupPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopupPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopupPage]
})
export class PopupPageModule {}
