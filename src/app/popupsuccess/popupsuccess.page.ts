import { MenuPage } from './../menu/menu';
import { Component } from '@angular/core';
import {
  IonicPage,
  MenuController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popupsuccess',
  templateUrl: 'popupsuccess.html',
})
export class PopupSuccessPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  private pickupTime = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public menuCtrl: MenuController
  ) {
    this.lottieConfig = {
      path: 'assets/icon/checked_done_.json',
      autoplay: true,
      loop: false,
    };

    this.pickupTime = this.navParams.get('pickupTime');
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
