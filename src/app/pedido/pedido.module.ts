import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PedidoPageRoutingModule } from './pedido-routing.module';

import { PedidoPage } from './pedido.page';


const routes: Routes = [
  {
    path: '',
    component: PedidoPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoPage]
})
export class PedidoPageModule {}
