import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss']
})
export class WalkthroughPage {
  animate: any;

  constructor(public route: ActivatedRoute) {}

  ionViewDidLoad() {}

  goLogin() {
    this.animate = 'animated bounceOutRight';

    setTimeout(() => {
      //this.navCtrl.setRoot(LoginPage);
    }, 1000);
  }

  goInto() {
    //this.navCtrl.setRoot(MenuPage);
  }
}
