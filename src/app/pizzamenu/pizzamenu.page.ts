import { Component } from '@angular/core'

/**
 * Generated class for the PizzamenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-pizzamenu',
  templateUrl: './pizzamenu.page.html',
  styleUrls: ['./pizzamenu.page.scss']
})

export class PizzamenuPage {
  tquantity: number = 0;

  constructor() {}

  ionViewDidLoad() {}

  deleteFromCart() {
    if (this.tquantity != 0) {
      this.tquantity--;
    }
  }

  addToCart() {
    this.tquantity++;
  }

  goPizzapage() {
    //this.navCtrl.push(PizzapagePage);
  }

  goCart() {
    //this.navCtrl.push(CartPage);
  }
}
