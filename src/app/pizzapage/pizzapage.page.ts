import { Component } from '@angular/core';

/**
 * Generated class for the PizzapagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-pizzapage',
  templateUrl: './pizzapage.page.html',
  styleUrls: ['./pizzapage.page.scss']
})

export class PizzapagePage {
  tquantity: number = 0;
  pizzaSize: string = '';
  pepperoni: boolean = false;
  sausage: boolean = false;
  mushrooms: boolean = false;

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

  goCart() {
    //this.navCtrl.push(CartPage);
  }
}
