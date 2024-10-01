import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { WhoPageRoutingModule } from './who-routing.module';

import { WhoPage } from './who.page';


const routes: Routes = [
  {
    path: '',
    component: WhoPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhoPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WhoPage]
})
export class RegisterPageModule {}
