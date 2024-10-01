import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup',
  templateUrl: './popup.page.html',
  styleUrls: ['./popup.page.scss']
})
export class PopupPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

  constructor(
    public route: ActivatedRoute
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
    //this.navCtrl.setRoot(MenuPage);
    //this.menuCtrl.enable(true);
  }
}
