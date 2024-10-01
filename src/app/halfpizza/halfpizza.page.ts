import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../service/product.service';
import {Product} from '../models/product.model';
import {OrderLine} from '../models/orderline.model';
import {Category} from '../models/category.model';


@Component({
  selector: 'app-halfpizza',
  templateUrl: './halfpizza.page.html',
  styleUrls: ['./halfpizza.page.scss']
})

export class HalfPizzaPage {

    products: Product[] = [];
    categoryId: string = '';
    halfPizzaId: string = '';
    pizzaSize: string = '';
    category: Category | any;
    isPizzaCategory: boolean = true;
    unds: any = null;

    constructor(
        public productService: ProductService,
        private route: ActivatedRoute
    ) {}

    ionViewDidLoad() {
        this.halfPizzaId ? this.route.snapshot.paramMap.get('halfPizzaId') : '';
        this.pizzaSize ? this.route.snapshot.paramMap.get('pizzaSize') : '';
        this.setCategoryPizzaId();
        this.getProducts();
    }

    setCategoryPizzaId() {
        //this.category = MenuPage.sCategories.find((category: any) => category.isPizzaCategory());
        this.category = null;
        this.categoryId = this.category.id;
        this.isPizzaCategory = this.category.isPizzaCategory();
    }

    getProducts() {
        this.productService.findAll(this.categoryId)
            .subscribe((data: any) => {
                    data.forEach((item: any) => {
                        if(item.type === "CUSTOMIZABLE_TOTAL") return;
                        //let product: Product = new Product(item, this.productService, MenuPage.sIngredients);
                        let product: Product | any;
                        if (this.category.isPizzaCategory()) {
                            let size = product.sizes.filter((s: any) => s.code == this.pizzaSize)[0];
                            product.price = size.price;
                        }
                        this.products.push(product);
                    });
                },
                (error: any) => {
                    console.error(error);
                });
    }

    setHalf(product2: Product) {
        try {
            // montamos un nuevo producto, de estos dos
            //const product1: Product = this.products.find(product => product.id == this.halfPizzaId);
            let product1: Product | any;
            const size1: any = product1.sizes.find((size: any) => size.code === this.pizzaSize);
            const size2: any = product2.sizes.find(size => size.code === this.pizzaSize);

            let price: number = size1.price;
            if(size2){
              if (size2.price > price) {
                price = size2.price;
              }
            }


            const name = "1/2 " + product1.name + " + 1/2 " + product2.name;

            const product: Product = new Product(
                {
                    id: 'half',
                    name: name,
                    description: name,
                    category: this.category.id,
                    price: price,
                    pizza: true,
                    available: true,
                    order: 1,
                    allergens: [],
                    sizes: [],
                    ingredients: []
                },
                null,
                MenuPage.sIngredients
            );

            let currentLine = new OrderLine(
                CartPage.order,
                product,
                this.category,
                MenuPage.sIngredients,
                MenuPage.sSizes
            );

            currentLine.setHalfAndHalf(true);
            currentLine.setImage('assets/imgs/half-pizza.png');
            currentLine.setSizeText(this.pizzaSize);

            CartPage.order.addLine(currentLine);
            this.goCart();
        } catch(e) {
            console.error(e);
            alert("Ha habido un problema interno, por favor inténtelo de nuevo más tarde o seleccione otra pizza");
        }
    }

    goCart() {
        this.navCtrl.push(CartPage)
            .then();
    }
}
