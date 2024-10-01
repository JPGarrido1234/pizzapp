import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import moment from 'moment';

@Component({
  selector: 'app-popupholidays',
  templateUrl: './popupholidays.page.html',
  styleUrls: ['./popupholidays.scss']
})
export class PopupHolidaysPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public opening: string = '';
  public description: string = '';

  constructor(
    private route: ActivatedRoute
  ) {
    this.lottieConfig = {
      path: 'assets/icon/4961-close.json',
      autoplay: true,
      loop: false,
    };

    //moment.locale('es');
    //this.opening = moment(this.navParams.get('opening')).format('L');
    //this.description = this.navParams.get('description');
  }

  ionViewDidLoad() {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  dismiss() {
    //this.navCtrl.setRoot(MenuPage);
    //this.menuCtrl.enable(true);
  }
}
