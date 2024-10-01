import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupPage } from './popup';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  declarations: [
    PopupPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupPage),
    LottieAnimationViewModule.forRoot()
  ],
})
export class PopupPageModule {}
