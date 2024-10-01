import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { PizzamenuPageRoutingModule } from './pizzamenu-routing.module';

import { PizzamenuPage } from './pizzamenu.page';


const routes: Routes = [
  {
    path: '',
    component: PizzamenuPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzamenuPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PizzamenuPage]
})
export class PizzamenuPageModule {}
