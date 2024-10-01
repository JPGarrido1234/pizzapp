import { Component, OnInit } from '@angular/core';
import { NgForm  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { OrderLine } from '../models/orderline.model';
import { Category } from '../models/category.model';

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

  products: Product[] = [];
    categoryId: string = '';
    categoryName: string = '';
    category: Category | any = null;
    isPizzaCategory: boolean = false;
    //unds: number | undefined = CartPage.order != undefined ? CartPage.order.unds : 0;
    unds: number = 0;

    ionViewDidLoad() {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId')!;
        this.categoryName =this.route.snapshot.paramMap.get('category')!;
        //this.category = MenuPage.sCategories.find(category => category.id == this.categoryId);
        this.isPizzaCategory = this.category.isPizzaCategory();
        this.getProducts();
    }

    ionViewDidEnter() {
        this.refreshCartUnds();
    }

    refreshCartUnds() {
        //this.unds = CartPage.order.unds;
    }

    getProducts() {
        this.productService.findAll(this.categoryId)
            .subscribe((data: any) => {
                    data.forEach((item: any) => {
                        //let product: Product = new Product(item, this.productService, MenuPage.sIngredients);
                        let product: any;
                        if (this.category.isPizzaCategory()) {
                            let size = product.sizes.filter((s: any) => s.code == 'IND')[0];
                            product.price = size.price;
                        }
                        this.products.push(product);
                    });
                },
                (error: any) => {
                    console.error(error);
                });
    }

    goProductPage(product: Product) {
        if(!product.available) return;
        //this.navCtrl.push(ProductPage, {productId: product.id});

    }

    addLineToOrder(product: Product) {
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

        if (this.category.isPizzaCategory()) {
            let code = 'IND'; // por defecto añadimos la pizza en tamaño individual
            //currentLine.setSize(code);
        }

        //CartPage.order.addLine(currentLine);
        this.refreshCartUnds();
    }

    goCart() {
        //this.navCtrl.push(CartPage);
        this.router.navigate(['/cart']);
    }
}
