import { Component, OnInit } from '@angular/core';
import { NgForm  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { OrderLine } from '../models/orderline.model';
import { Category } from '../models/category.model';
import { Storage } from '@capacitor/storage';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-pedido',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  error_msg: string = '';
  disable: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, public productService: ProductService) {}

  ngOnInit() {}
    order = new Order();
    products: Product[] = [];
    categoryId: string = '';
    categoryName: string = '';
    category: Category | any = null;
    isPizzaCategory: boolean = false;
    //unds: number | undefined = CartPage.order != undefined ? CartPage.order.unds : 0;
    unds: number | undefined = this.order != undefined ? this.order.unds : 0;

    //STORAGE
    categories_storage: Category[] = [];
    ingredients_storage: any[] = [];
    sizes_storage: any[] = [];

    ionViewDidLoad() {
        this.loadCategories();
        this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
        this.categoryName =this.route.snapshot.paramMap.get('category')!;
        //this.category = MenuPage.sCategories.find(category => category.id == this.categoryId);
        this.category = this.categories_storage.find((category: any) => category.id == this.categoryId);
        this.isPizzaCategory = this.category.isPizzaCategory();
        this.getProducts();
    }

    ionViewDidEnter() {
        this.refreshCartUnds();
    }

    refreshCartUnds() {
        //this.unds = CartPage.order.unds;
        this.unds = this.order.unds;
    }

    getProducts() {
        this.loadIngredients();
        this.productService.findAll(this.categoryId)
        .then((data: any) => {
            data.forEach((item: any) => {
                //let product: Product = new Product(item, this.productService, MenuPage.sIngredients);
                let product: Product = new Product(item, this.productService, this.ingredients_storage);
                if (this.category.isPizzaCategory()) {
                    let size = product.sizes.filter((s: any) => s.code == 'IND')[0];
                    //product.price = size.price;
                    if (size.price !== undefined) {
                      product.price = size.price;
                    } else {
                      product.price = 0; // Proporciona un valor predeterminado
                    }
                }
                this.products.push(product);
                console.log(this.products);
            });
        },
        (error: any) => {
            console.error(error);
        });
    }

    goProductPage(product: Product) {
        if(!product.available) return;
        //this.navCtrl.push(ProductPage, {productId: product.id});
        this.router.navigate(['/product', { productId: product.id }]);

    }

    addLineToOrder(product: Product) {
      this.loadSizes();
        if(!product.available) return;
        /*
        let currentLine = new OrderLine(
            CartPage.order,
            product,
            this.category,
            MenuPage.sIngredients,
            MenuPage.sSizes
        );
        */
        let currentLine = new OrderLine(
          this.order,
          product,
          this.category,
          this.ingredients_storage,
          this.sizes_storage
      );


        if (this.category.isPizzaCategory()) {
            let code = 'IND'; // por defecto añadimos la pizza en tamaño individual
            currentLine.setSize(code);
        }

        //CartPage.order.addLine(currentLine);
        this.order.addLine(currentLine);
        this.refreshCartUnds();
    }

    goCart() {
        //this.navCtrl.push(CartPage);
        this.router.navigate(['/cart']);
    }

    async loadCategories() {
      const { value } = await Storage.get({ key: 'categories' });
      if (value) {
        this.categories_storage = JSON.parse(value);
      }
    }

    async loadIngredients() {
      const { value } = await Storage.get({ key: 'ingredients' });
      if (value) {
        this.ingredients_storage = JSON.parse(value);
      }
    }

    async loadSizes() {
      const { value } = await Storage.get({ key: 'sizes' });
      if (value) {
        this.sizes_storage = JSON.parse(value);
      }
    }
}
