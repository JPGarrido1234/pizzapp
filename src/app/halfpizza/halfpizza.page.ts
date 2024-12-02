import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductService} from '../service/product.service';
import {Product} from '../models/product.model';
import {OrderLine} from '../models/orderline.model';
import {Category} from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';
import { Order } from '../models/order.model';
import { Preferences } from '@capacitor/preferences';
import { Size } from '../models/size.model';
import { OrderService } from '../service/order.service';


@Component({
  selector: 'app-halfpizza',
  templateUrl: './halfpizza.page.html',
  styleUrls: ['./halfpizza.page.scss']
})

export class HalfPizzaPage implements OnInit{

    products: Product[] = [];
    categoryId: string = '';
    halfPizzaId: string = '';
    pizzaSize: string = '';
    category: Category | any;
    isPizzaCategory: boolean = true;
    unds: any = null;
    order: Order | any = null;

    //STORAGE
    categories_storage: Category[] = [];
    ingredients_storage: Ingredient[] = [];
    sizes_storage: Size[] = [];

    constructor(
      private orderService: OrderService,
        public productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
      /*
        this.loadCategories()
        .then(() => {
          console.log('Categories loaded');
        });
        this.loadIngredients()
        .then(() => {
          console.log('Ingredients loaded');
        });
        this.loadSizes()
        .then(() => {
          console.log('Sizes loaded');
      });

      this.getProducts();
      */
      this.loadCategories().then(() => {
        this.loadIngredients().then(() => {
            this.loadSizes().then(() => {
              this.route.paramMap.subscribe(params => {
                this.halfPizzaId = params.get('halfPizzaId') || '';
                this.pizzaSize = params.get('pizzaSize') || '';
                this.categoryId = params.get('categoryId') || '';

                console.log('Category ID: ' + this.categoryId);
                this.setCategoryPizzaId();
                this.getProducts();

                this.getCurrentOrder().then((result: any) => {
                  this.order = result;
                  this.unds = this.order.unds;
                  console.log('CURRENT ORDER: ', this.order);
                  this.goCart();
                });
              });
            });
        });
    })
    }

    ionViewDidLoad() {
      this.route.paramMap.subscribe(params => {
        this.halfPizzaId = params.get('halfPizzaId') || '';
        this.pizzaSize = params.get('pizzaSize') || '';
        this.categoryId = params.get('categoryId') || '';

        this.setCategoryPizzaId();
        this.getProducts();

        this.getCurrentOrder().then((result: any) => {
          this.order = result;
          this.unds = this.order.unds;
          //console.log('CURRENT ORDER: ', this.order);
          this.goCart();
        });
      });
    }

    setCategoryPizzaId() {
        //this.category = MenuPage.sCategories.find((category: any) => category.isPizzaCategory());
        this.category = this.categories_storage.find((category: any) => category.name.toLowerCase().includes('pizzas'));
        //this.category = null;
        this.categoryId = this.category.id;
        this.isPizzaCategory = this.category.name.toLowerCase().includes('pizzas');
    }

    getProducts() {
        this.productService.findAll(this.categoryId)
            .then((data:  Product[]) => {
                    data.forEach((item: any) => {
                        console.log('Item:', item);
                        if(item.type === "CUSTOMIZABLE_TOTAL") return;
                        //let product: Product = new Product(item, this.productService, MenuPage.sIngredients);
                        let product: Product = new Product(item, this.productService, this.ingredients_storage);
                        if (this.category.name.toLowerCase().includes('pizzas')) {
                            let size = product.sizes.filter((s: any) => s.code == this.pizzaSize)[0];
                            product.price ? size.price : '';
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
            let product1: Product | any = this.products.find(product => product.id == this.halfPizzaId);
            const size1: any = product1.sizes.find((size: any) => size.code === this.pizzaSize);
            const size2: any = product2.sizes.find(size => size.code === this.pizzaSize);

            let price: number = size1.price;
            if(size2){
              if (size2.price > price) {
                price = size2.price;
              }
            }


            const name = "1/2 " + product1.name + " + 1/2 " + product2.name;
            /*
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
            */
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
              ingredients: [],
              active: true,
              ingredientsNotAvailable: [],
              image: '',
              type: ''
            },
            this.productService,
            this.ingredients_storage
           );

            let currentLine = new OrderLine(
                this.order,
                product,
                this.category,
                this.ingredients_storage,
                this.sizes_storage
            );

            currentLine.setHalfAndHalf(true);
            currentLine.setImage('assets/imgs/half-pizza.png');
            currentLine.setSizeText(this.pizzaSize);

            this.getCurrentOrder().then(() => {
              this.unds = this.order.unds;
              this.order.addLine(currentLine);
              console.log('CURRENT ORDER: ', this.order);
              this.goCart();
            });
        } catch(e) {
            console.error(e);
            alert("Ha habido un problema interno, por favor inténtelo de nuevo más tarde o seleccione otra pizza");
        }
    }

    getCurrentOrder(): Promise<any> {
      return this.orderService.getOrder().then((order: any) => {
        this.order = order;
      });
    }

    goCart() {
        //this.navCtrl.push(CartPage)
        //.then();
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
