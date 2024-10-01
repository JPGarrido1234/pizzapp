import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupSuccessPage } from './popupsuccess';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
    declarations: [
        PopupSuccessPage,
    ],
    imports: [
        IonicPageModule.forChild(PopupSuccessPage),
        LottieAnimationViewModule.forRoot()
    ],
})
export class PopupSuccessPageModule { }
