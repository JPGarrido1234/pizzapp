import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupHolidaysPage } from './popupholidays';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
    declarations: [
        PopupHolidaysPage,
    ],
    imports: [
        IonicPageModule.forChild(PopupHolidaysPage),
        LottieAnimationViewModule.forRoot()
    ],
})
export class PopupHolidaysPageModule { }
