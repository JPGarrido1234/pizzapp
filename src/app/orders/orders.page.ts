import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import * as moment from 'moment';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { OrderLine } from '../models/orderline.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})

export class OrdersPage {
  orders: Order[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private alertController: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    const myUser: User = this.userService.getUser();

    this.userService.getOrders(myUser.id).subscribe(
      (orders: any) => {
        this.orders = orders.map((order: any) => {
          order.date = moment(order.date).format('DD.MM.YYYY');
          return order;
        });
      },
      async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.message,
            buttons: ['OK'],
          });

          await alert.present();
      }
    );
  }

  async cloneOrder(order: Order) {
    //CartPage.order = new Order();

    const productsFromServer: Product[] = await Promise.all(
      order.lines.map((line) => {
        return this.productService
          .findById(line.productId)
          .toPromise() as Promise<Product>;
      })
    );

    const products: Product[] = productsFromServer.map((pfs) => {
      const product: Product = new Product(
        pfs,
        this.productService,
        MenuPage.sIngredients
      );

      const category = MenuPage.sCategories.find(
        (category: Category) => category.id == pfs.category
      );

      if (category.isPizzaCategory()) {
        let size = product.sizes.filter((s) => s.code == 'IND')[0];
        product.price = size.price;
      }

      return product;
    });

    const error: string[] = [];

    const lines: OrderLine[] = order.lines.map((line: OrderLine) => {
      const product = products.find((p) => p.id == line.productId);

      if (!product || !product.active || !product.available) {
        error.push(`${product.name} no está disponible`);
        return null;
      }

      const allIngredientsOk = line.ingredientsToAdd.every((ingredientId) => {
        const ingredient = product.allIngredients.find(
          (ingredient) => ingredient.id == ingredientId
        );

        if (!ingredient || !ingredient.active || !ingredient.available) {
          error.push(
            `${product.name} no se puede aplicar la misma configuración de ingredientes extra a añadir`
          );
          return false;
        }
        return true;
      });

      const category = MenuPage.sCategories.find(
        (category: Category) => category.id == product.category
      );

      const orderLine: OrderLine = new OrderLine(
        CartPage.order,
        product,
        category,
        MenuPage.sIngredients,
        MenuPage.sSizes
      );

      if (category.isPizzaCategory()) {
        if (allIngredientsOk) {
          orderLine.ingredientsToAdd = line.ingredientsToAdd;
          orderLine.ingredientsToAddText = line.ingredientsToAddText;
        }
        orderLine.ingredientsToRemove = line.ingredientsToRemove;
        orderLine.ingredientsToRemoveText = line.ingredientsToRemoveText;
        orderLine.notes = line.notes;
        orderLine.isHalfAndHalf = line.isHalfAndHalf;
        orderLine.half = line.half;
        orderLine.und = line.und;
        orderLine.priceUnd = line.priceUnd;
        orderLine.priceTotal = line.priceTotal;
      }

      return orderLine;
    });

    //CartPage.order.lines = lines.filter((line) => line != null);
    //CartPage.order.calculateTotal();

    //this.navCtrl.push(CartPage);

    if (error.length > 0) {
      const alert = await this.alertController.create({
        header: 'ATENCIÓN',
        message: error.join('<br>'),
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
}
