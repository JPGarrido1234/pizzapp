import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import {
  IonicPage,
  MenuController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-popupholidays',
  templateUrl: 'popupholidays.html',
})
export class PopupHolidaysPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  private opening: string = '';
  private description: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public menuCtrl: MenuController
  ) {
    this.lottieConfig = {
      path: 'assets/icon/4961-close.json',
      autoplay: true,
      loop: false,
    };

    moment.locale('es');
    this.opening = moment(this.navParams.get('opening')).format('L');
    this.description = this.navParams.get('description');
  }

  ionViewDidLoad() {}

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  dismiss() {
    this.navCtrl.setRoot(MenuPage);
    this.menuCtrl.enable(true);
  }
}
