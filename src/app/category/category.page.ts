import { Component, OnInit } from '@angular/core';
import { NgForm  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { OrderService } from '../service/order.service';
import { OrderLine } from '../models/orderline.model';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { Ingredient } from '../models/ingredient.model';
import { Preferences } from '@capacitor/preferences';
import { Size } from '../models/size.model';

@Component({
  selector: 'app-pedido',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  error_msg: string = '';
  disable: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, public productService: ProductService, private orderService: OrderService) {}

    order: Order = new Order();
    products: Product[] = [];
    categoryId: string | null = null;
    categoryName: string | null = null;
    category: Category | any = null;
    isPizzaCategory: boolean = false;
    //unds: number | undefined = CartPage.order != undefined ? CartPage.order.unds : 0;
    unds: number = this.order != undefined ? this.order.unds : 0;

    //STORAGE
    categories_storage: Category[] = [];
    ingredients_storage: Ingredient[] = [];
    sizes_storage: Size[] = [];

    isLoading: boolean = true;

    ngOnInit() {
      setTimeout(() => {
        this.getProducts();
        this.isLoading = false;
      }, 2000);

      this.route.paramMap.subscribe(params => {
        this.categoryId = params.get('categoryId');
        console.log('Category ID: ' + this.categoryId);
        this.categoryName = params.get('category');
        this.loadCategories()
        .then(() => {
          //this.category = MenuPage.sCategories.find(category => category.id == this.categoryId);
          this.category = this.categories_storage.find((category: Category) => category.id == this.categoryId);

          if(this.category) {
              this.isPizzaCategory = this.category.name.toLowerCase().includes('pizzas');
            }
        });
      });
      //this.refreshCartUnds();
    }

    ionViewDidLoad() {
      setTimeout(() => {
        this.getProducts();
        this.isLoading = false;
      }, 2000);

      this.route.paramMap.subscribe(params => {
        this.categoryId = params.get('categoryId');
        console.log('Category ID: ' + this.categoryId);
        this.categoryName = params.get('category');
        this.loadCategories()
        .then(() => {
          //this.category = MenuPage.sCategories.find(category => category.id == this.categoryId);
          this.category = this.categories_storage.find((category: Category) => category.id == this.categoryId);

          if(this.category) {
              this.isPizzaCategory = this.category.name.toLowerCase().includes('pizzas');
            }
        });
      });
      this.refreshCartUnds();
    }

    ionViewDidEnter() {
        this.refreshCartUnds();
    }

    refreshCartUnds() {
      this.unds = this.order.unds;
      console.log('Order:', this.order, 'Unds:', this.unds);
      this.orderService.setOrder(this.order);
    }

    getProducts() {
        this.loadIngredients()
        .then(() => {
          console.log('Ingredients loaded');
          console.log(this.ingredients_storage);
          if (this.categoryId) {
            this.productService.findAll(this.categoryId)
            .then((data: Product[]) => {
                console.log(data);
                data.forEach((item: any) => {
                    //let product: Product = new Product(item, this.productService, MenuPage.sIngredients);
                    let product: Product = new Product(item, this.productService, this.ingredients_storage);
                    if(product.sizes !== undefined) {
                      if (this.category.name.toLowerCase().includes('pizzas')) {
                        let size = product.sizes.filter((s: any) => s.code == 'IND')[0];
                        //product.price = size.price;
                        if (size !== undefined && size.price !== undefined) {
                          product.price = size.price;
                        } else {
                          product.price = 0; // Proporciona un valor predeterminado
                        }
                    }
                    this.products.push(product);
                    }
                });
            },
            (error: any) => {
                console.error(error);
            });
          } else {
            console.error('Category ID is null');
          }
        });
    }

    getProductos() {
      // Lógica para obtener los productos
      this.productService.getProductsByCategory(this.categoryId).subscribe((products: Product[]) => {
        this.products = products;
      });
    }

    goProductPage(product: Product) {
        if(!product.available) return;
        //this.navCtrl.push(ProductPage, {productId: product.id});
        this.router.navigate(['/product', product.id ]);

    }

    addLineToOrder(product: Product) {
      if(!product.available) return;
        this.loadSizes().then(() => {
          let currentLine = new OrderLine(
            this.order,
            product,
            this.category,
            this.ingredients_storage,
            this.sizes_storage
          );

          if (this.category.name.toLowerCase().includes('pizzas')) {
              let code = 'IND'; // por defecto añadimos la pizza en tamaño individual
              currentLine.setSize(code);
          }

          this.order.addLine(currentLine);
          //this.orderService.setOrder(this.order);
          this.refreshCartUnds();
        });
      }

    goCart() {
        //this.navCtrl.push(CartPage);
        this.router.navigate(['/cart']);
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
