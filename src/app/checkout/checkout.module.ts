import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';


const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckoutPage]
})
export class CategoryPageModule {}
