import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PizzapagePageRoutingModule } from './pizzapage-routing.module';

import { PizzapagePage } from './pizzapage.page';


const routes: Routes = [
  {
    path: '',
    component: PizzapagePage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzapagePageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PizzapagePage]
})
export class PizzamenuPageModule {}
