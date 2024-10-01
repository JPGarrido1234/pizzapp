import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PizzapagePage } from './pizzapage.page';


const routes: Routes = [
  {
    path: 'pizzapage',
    component: PizzapagePage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class PizzapagePageRoutingModule {}
