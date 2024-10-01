import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { LegalPageRoutingModule } from './legal-routing.module';

import { LegalPage } from './legal.page';


const routes: Routes = [
  {
    path: '',
    component: LegalPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LegalPage]
})
export class RegisterPageModule {}
