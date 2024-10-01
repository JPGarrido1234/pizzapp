import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { CodePageRoutingModule } from './code-routing.module';

import { CodePage } from './code.page';


const routes: Routes = [
  {
    path: '',
    component: CodePage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodePageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CodePage]
})
export class CodePageModule {}
