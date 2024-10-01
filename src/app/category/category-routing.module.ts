import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryPage } from './category.page';


const routes: Routes = [
  {
    path: 'category',
    component: CategoryPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {}
