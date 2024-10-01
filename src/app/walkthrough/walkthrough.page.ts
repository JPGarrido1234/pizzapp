import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import { LoginPage } from '../login/login'
import { MenuPage } from '../menu/menu'

/**
 * Generated class for the WalkthroughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {
  animate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}

  goLogin() {
    this.animate = 'animated bounceOutRight';

    setTimeout(() => {
      this.navCtrl.setRoot(LoginPage);
    }, 1000);
  }

  goInto() {
    this.navCtrl.setRoot(MenuPage);
  }
}
