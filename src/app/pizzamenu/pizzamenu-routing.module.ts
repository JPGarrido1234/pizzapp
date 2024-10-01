import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PizzamenuPage } from './pizzamenu.page';


const routes: Routes = [
  {
    path: 'pizzamenu',
    component: PizzamenuPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class PizzamenuPageRoutingModule {}
