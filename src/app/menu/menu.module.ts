import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  {
    path: '',
    component: MenuPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
