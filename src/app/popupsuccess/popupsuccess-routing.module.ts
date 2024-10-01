import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupSuccessPage } from './popupsuccess.page';


const routes: Routes = [
  {
    path: 'popupsuccess',
    component: PopupSuccessPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class PopupSuccessPageRoutingModule {}
