import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';


const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
