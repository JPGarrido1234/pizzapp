import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';


const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
