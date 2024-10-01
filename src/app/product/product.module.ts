import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';


const routes: Routes = [
  {
    path: '',
    component: ProductPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
