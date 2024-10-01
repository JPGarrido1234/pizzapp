import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { HalfPizzaPageRoutingModule } from './halfpizza-routing.module';

import { HalfPizzaPage } from './halfpizza.page';


const routes: Routes = [
  {
    path: '',
    component: HalfPizzaPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HalfPizzaPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HalfPizzaPage]
})
export class HalfPizzaPageModule {}
