import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalkthroughPage } from './walkthrough.page';


const routes: Routes = [
  {
    path: 'walkthrough',
    component: WalkthroughPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)

  ],
  exports: [RouterModule],
})
export class WalkthroughPageRoutingModule {}
