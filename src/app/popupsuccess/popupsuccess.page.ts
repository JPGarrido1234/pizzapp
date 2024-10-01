import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popupsuccess',
  templateUrl: './popupsuccess.page.html',
  styleUrls: ['./popupsuccess.page.scss']
})
export class PopupSuccessPage {
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;
  public pickupTime: any = '';

  constructor(private route: ActivatedRoute
  ) {
    this.lottieConfig = {
      path: 'assets/icon/checked_done_.json',
      autoplay: true,
      loop: false,
    };

    this.pickupTime = this.route.snapshot.paramMap.get('pickupTime');
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
