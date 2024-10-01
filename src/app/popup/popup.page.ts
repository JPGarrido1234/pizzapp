import { MenuPage } from './../menu/menu'
import { Component } from '@angular/core'
import { IonicPage, MenuController, NavController, NavParams, ViewController } from 'ionic-angular'

/**
 * Generated class for the PopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html',
})
export class PopupPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

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
