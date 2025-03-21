import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
//import moment from 'moment';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { OrderLine } from '../models/orderline.model';
import { Category } from '../models/category.model';
import { Preferences } from '@capacitor/preferences';
import * as moment from 'moment';
import { Ingredient } from '../models/ingredient.model';
import { Size } from '../models/size.model';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})

export class OrdersPage implements OnInit {
  orders: Order[] = [];
  order: Order | any = null;
  unds: number = 0;
  total: number = 0;
  lines: OrderLine[] = [];
  //STORAGE
  categories_storage: Category[] = [];
  ingredients_storage: Ingredient[] = [];
  sizes_storage: Size[] = [];
  myUser: User = {
    id: '', name: '', login: '', address: '', zip: '', birthDate: '', password: '',
    phone: '',
    codeValidated: false,
    logged: false,
    active: false,
    role: '',
    setLogged: function (logged: boolean): void {
      throw new Error('Function not implemented.');
    },
    isLogged: function (): boolean {
      throw new Error('Function not implemented.');
    },
    isActive: function (): boolean {
      throw new Error('Function not implemented.');
    }
  };

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private alertController: AlertController,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUser().then(async (user: any) => {
      this.myUser = user;

      this.userService.getOrders(this.myUser.id).subscribe((orders: any) => {
          this.orders = Array.isArray(orders) ? orders.map((order: any) => {
            order.date = moment(order.date).format('DD.MM.YYYY');
            return order;
          }) : [];

          if (!Array.isArray(orders)) {
            console.error('Expected orders to be an array, but got:', orders);
          }
        },
        async (error: any) => {
            const alert = await this.alertController.create({
              header: 'Error',
              message: error.message,
              buttons: ['OK'],
            });

            await alert.present();
        }
      );
    });
  }

  ionViewDidLoad() {}

  ionViewDidEnter() {
    this.userService.getUser().then(async (user: any) => {
      this.myUser = user;
      //console.log('User: ', this.user);

      console.log('User: ' + this.myUser.id);
      this.userService.getOrders(this.myUser.id).subscribe(
        (orders: Order) => {
          this.orders = Array.isArray(orders) ? orders.map((order: any) => {
            order.date = moment(order.date).format('DD.MM.YYYY');
            return order;
          }) : [];

          if (!Array.isArray(orders)) {
            console.error('Expected orders to be an array, but got:', orders);
          }
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
    });
  }

  async cloneOrder(order: Order) {
    //CartPage.order = new Order();
    this.loadCategories().then(() => {
      this.loadIngredients().then(() => {
          this.loadSizes().then(async () => {
            this.order = order;
            try {
              const productsFromServer: Product[] = await Promise.all(
                this.order.lines.map(async (line: OrderLine) => {
                  console.log('Fetching product with ID:', line.productId);
                  try {
                    // Ensure the product ID is valid
                    if (!line.productId) {
                      throw new Error(`Invalid product ID: ${line.productId}`);
                    }
                    return lastValueFrom(this.productService.findById(line.productId));
                  } catch (error) {
                    console.error('Error fetching product:', error);
                    return null; // Or handle it accordingly (e.g., returning default or placeholder product)
                  }
                })
              );

              const products: Product[] = productsFromServer.map((pfs) => {
                const product: Product = new Product(
                  pfs,
                  this.productService,
                  this.ingredients_storage
                );

                const category = this.categories_storage.find(
                  (category: Category) => category.id == pfs.category
                );

                if(category !== undefined) {
                  if (category.name.toLowerCase().includes('pizzas')) {
                    let size = product.sizes.filter((s) => s.code == 'IND')[0];
                    if(size.price !== undefined) {
                      product.price = size.price;
                    }
                  }
                }
                //console.log('Product: ' + product.name);
                return product;
              });

              const error: string[] = [];

            this.order.lines.map((line: OrderLine) => {
              const product = products.find((p) => p.id == line.productId);

              if (!product || !product.active || !product.available) {
                if (product) {
                  error.push(`${product.name} no está disponible`);
                } else {
                  error.push(`Producto con ID ${line.productId} no encontrado`);
                }
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

              const category = this.categories_storage.find(
                (category: Category) => category.id == product.category
              );

              if (!category) {
                error.push(`Category not found for product ${product.name}`);
                return null;
              }

              const orderLine: OrderLine = new OrderLine(
                this.order,
                product,
                category,
                this.ingredients_storage,
                this.sizes_storage
              );

              if (category.name.toLowerCase().includes('pizzas')) {
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

              //this.order.addLine(orderLine);
              this.order.lines.push(orderLine);
              console.log(orderLine);
              this.unds = 0;
              this.total = 0;
              this.lines.forEach((line: any) => {
                if(line.product !== undefined) {
                  this.total += line.priceTotal;
                  this.unds += line.und;
                }
              });


              return orderLine;
            //}
            //return null;

            });

            if (error.length > 0) {
              const alert = await this.alertController.create({
                header: 'ATENCIÓN',
                message: error.join('<br>'),
                buttons: ['OK'],
              });

              await alert.present();
            }

              //console.log('Products from server: ' + JSON.stringify(productsFromServer));
            } catch (error) {
              console.error('Error fetching products from server:', error);
            }



            //CartPage.order.lines = lines.filter((line) => line != null);
            this.lines = this.lines.filter((line: any) => line.product !== undefined);
            this.orderService.setOrder(this.order);
            //console.log('Order: ' + JSON.stringify(this.order.lines));
            //CartPage.order.calculateTotal();


            this.router.navigate(['/cart']);
          });
      });
  })
    //order = new Order();

  }

  async loadCategories() {
    const { value } = await Preferences.get({ key: 'categories' });
    if (value) {
      this.categories_storage = JSON.parse(value);
    }
  }

  async loadIngredients() {
    const { value } = await Preferences.get({ key: 'ingredients' });
    if (value) {
      this.ingredients_storage = JSON.parse(value);
    }
  }

  async loadSizes() {
    const { value } = await Preferences.get({ key: 'sizes' });
    if (value) {
      this.sizes_storage = JSON.parse(value);
    }
  }
}
