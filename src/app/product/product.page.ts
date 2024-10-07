import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { OrderLine } from '../models/orderline.model';
import { Order } from '../models/order.model';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss']
})
export class ProductPage implements OnInit {

    product: Product | any;
    currentLine: OrderLine | any;
    category: Category | any;


    ingredientsBaseVisible = false;
    ingredientsPizzaVisible = false;
    ingredientsExtraVisible = false;

    ingredientsBaseForCheckbox: any[] = [];
    ingredientsExtraForCheckbox: any[] = [];

    sizesForCheckbox: any[] = [];

    backend_url = environment.BACKEND_URL;
    mode = 'add';
    order: Order | any = new Order();

    //STORAGE
    categories_storage: Category[] = [];
    ingredients_storage: any[] = [];
    sizes_storage: any[] = [];
    config_storage: any = {};
    //unds: number = CartPage.order != undefined ? CartPage.order.unds : 0;
    unds: number = this.order != undefined ? this.order.unds : 0;

    constructor(
      public productService: ProductService,
      private route: ActivatedRoute,
      private router: Router) {}


    ngOnInit(): void {
      if(this.order == undefined) {
            this.order = new Order();
        }

        this.loadCategories().then(() => {
            this.loadIngredients().then(() => {
                this.loadSizes().then(() => {
                    this.loadConfig().then(() => {
                        this.getProduct();
                    });
                });
            });
        })
        //this.getProduct();
    }



    ionViewDidLoad() {
        if(this.order == undefined) {
            this.order = new Order();
        }

        this.getProduct();
    }

    ionViewDidEnter() {
        this.refreshCartUnds();
    }

    refreshCartUnds() {
        this.unds = this.order.unds;
    }

    getProduct() {
      this.route.paramMap.subscribe(params => {
        let productId = params.get('productId');
        if (productId) {
          console.log('Product ID: ' + productId);
          this.productService.findById(productId).subscribe(
            (item: Product) => {
              this.product = new Product(item, this.productService, this.ingredients_storage);

              try {
                this.category = this.categories_storage.find((category: Category) => category.id == this.product.category);
                console.log('Category:', this.category);
                var array = this.categories_storage;
                console.log('Categories_storage:', array);
              } catch (e) {
                console.error("Can not find product category");
              }
              console.log('Product:', this.product);

              //this.loadCategories();
              //this.loadIngredients()
              this.getCurrentLine();
              this.buildSizesCheckboxes();
              this.buildIngredientsCheckboxes();
            },
            (error: any) => {
              console.error(error);
            }
          );
        }
      });
    }

    getCurrentLine() {
      this.route.paramMap.subscribe(params => {
        this.currentLine = params.get('currentLine');
        console.log('Current Line: ' + this.currentLine);
        if(this.currentLine == undefined) {
            this.mode = 'add';
            this.currentLine = new OrderLine(
                this.order,
                this.product,
                this.category,
                this.ingredients_storage,
                this.sizes_storage
            );
        } else {
            this.mode = 'edit';
        }
      });
    }

    buildSizesCheckboxes() {
      this.loadSizes().then(() => {

        if(this.category == undefined) return;
        if(!this.category.name.toLowerCase().includes('pizzas')) return;

        this.product.sizes.forEach((size: any) => {
            if(size.price <= 0){
                return;
            }

            let sizeName = '-';
            try {
                sizeName = this.sizes_storage.find(s => s.code == size.code).name;
            } catch(e) {
                console.error("Can not get size name of size " + size.code);
            }

            this.sizesForCheckbox.push({
                code: size.code,
                price: size.price,
                name: sizeName
            });
        });

        // this.setSize(this.product.sizes[0].code);
        this.setSize('IND');
      });
    }

    buildIngredientsCheckboxes() {
      this.loadIngredients().then(() => {
        if(this.category == undefined) return;
        if(!this.category.name.toLowerCase().includes('pizzas')) return;

        this.product.ingredients.forEach((ingredient: any) => {
            try {
                let checked: boolean = false;

                if(this.currentLine.ingredientsToRemove.indexOf(ingredient) < 0) {
                    checked = true;
                }

                let ingredientComplete = this.ingredients_storage.find(i => i.id == ingredient);
                if(!ingredientComplete.available) {
                    checked = false;
                }
                this.ingredientsBaseForCheckbox.push({
                    val: ingredient,
                    name: ingredientComplete.name,
                    price: ingredientComplete.price,
                    isChecked: checked,
                    base: ingredientComplete.base,
                    available: ingredientComplete.available
                });
            } catch (e) {
                console.error(e);
            }
        });

        this.ingredients_storage.forEach(ingredient => {
            if (!ingredient.active) return;

            let checked: boolean = false;

            if(this.currentLine.ingredientsToAdd.indexOf(ingredient.id) > -1) {
                checked = true;
            }

            this.ingredientsExtraForCheckbox.push({
                val: ingredient.id,
                name: ingredient.name,
                price: ingredient.price,
                available: ingredient.available,
                isChecked: checked,
                base: ingredient.base
            });
        });
      });

    }

    setIngredientsToRemove(ingredient: any) {
        if(!this.checkIfCanRemoveIngredient()) {
            setTimeout(() => {
                ingredient.isChecked = true;
            }, 100);
            return;
        }

        let ingredientsToRemove: string[] = [];
        this.ingredientsBaseForCheckbox.forEach(ingredientObj => {
            if(!ingredientObj.isChecked) {
                ingredientsToRemove.push(ingredientObj.val);
            }
        });
        this.currentLine.setIngredientsToRemove(ingredientsToRemove);
    }

    checkIfCanRemoveIngredient() {
        if(this.product.type == "CUSTOMIZABLE_TOTAL") return true;

        let max: number = this.config_storage["ingredients-max-remove"];
        let counter: number = 0;

        this.ingredientsBaseForCheckbox.forEach(ingredientObj => {
            if(!ingredientObj.base && !ingredientObj.isChecked) {
                counter++;
            }
        });

        return counter <= max;
    }

    setIngredientsToAdd(ingredient: any) {
        if(!this.checkIfCanAddIngredient()) {
            setTimeout(() => {
                ingredient.isChecked = false;
            }, 100);
            return;
        }

        let ingredientsToAdd: string[] = [];
        this.ingredientsExtraForCheckbox.forEach(ingredientObj => {
            if(ingredientObj.isChecked) {
                ingredientsToAdd.push(ingredientObj.val);
            }
        });
        this.currentLine.setIngredientsToAdd(ingredientsToAdd);
    }

    checkIfCanAddIngredient() {
        if(this.product.type == "CUSTOMIZABLE_TOTAL") return true;

        let max: number = this.config_storage["ingredients-max-add"];
        let counter: number = 0;

        this.ingredientsExtraForCheckbox.forEach(ingredientObj => {
            if(ingredientObj.isChecked) {
                counter++;
            }
        });

        return counter <= max;
    }

    setSize(size: string) {
        this.currentLine.setSize(size);
    }

    addUnd() {
        this.currentLine.addUnd();
    }

    removeUnd() {
        this.currentLine.removeUnd();
    }

    setHalf(halfPizzaId: string, pizzaSize: string) {
      /*
      this.navCtrl.push(HalfPizzaPage, {
          halfPizzaId: this.product.id,
          pizzaSize: this.currentLine.size
      });
      */
      this.router.navigate(['/halfpizza', halfPizzaId, pizzaSize]);
    }

    addLineToOrder() {
        this.currentLine.setOrder(this.order);
        this.order.addLine(this.currentLine);
        this.goCart();
    }

    editLine() {
        this.goCart();
    }

    goCart() {
        //this.navCtrl.push(CartPage);
        this.router.navigate(['/cart']);
    }

    async loadCategories() {
      const { value } = await Preferences.get({ key: 'categories' });
      if (value) {
        this.categories_storage = JSON.parse(value) as Category[];
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

    async loadConfig() {
      const { value } = await Preferences.get({ key: 'config' });
      if (value) {
        this.config_storage = JSON.parse(value);
      }
    }
}
