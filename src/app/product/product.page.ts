import { CartPage } from './../cart/cart';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { MenuPage } from '../../pages/menu/menu';
import { OrderLine } from '../../models/orderline.model';
import { Order } from '../../models/order.model';
import { environment } from '../../environments/environment';
import {HalfPizzaPage} from '../halfpizza/halfpizza';


@IonicPage()
@Component({
    selector: 'page-product',
    templateUrl: 'product.html',
})
export class ProductPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductService) {
    }

    product: Product;
    currentLine: OrderLine;
    category: Category;

    ingredientsBaseVisible = false;
    ingredientsPizzaVisible = false;
    ingredientsExtraVisible = false;

    ingredientsBaseForCheckbox: any[] = [];
    ingredientsExtraForCheckbox: any[] = [];

    sizesForCheckbox: any[] = [];

    backend_url = environment.BACKEND_URL;
    mode = 'add';

    unds: number = CartPage.order != undefined ? CartPage.order.unds : 0;

    ionViewDidLoad() {
        if(CartPage.order == undefined) {
            CartPage.order = new Order();
        }

        this.getProduct();
    }

    ionViewDidEnter() {
        this.refreshCartUnds();
    }

    refreshCartUnds() {
        this.unds = CartPage.order.unds;
    }

    getProduct() {
        let productId = this.navParams.get('productId');

        this.productService.findById(productId)
            .subscribe((item: any) => {
                this.product = new Product(item, this.productService, MenuPage.sIngredients);

                try {
                    this.category = MenuPage.sCategories.find(category => category.id == this.product.category);
                } catch (e) {
                    console.error("Can not find product category ");
                }

                this.getCurrentLine();
                this.buildSizesCheckboxes();
                this.buildIngredientsCheckboxes();
            },
            (error) => {
                console.error(error);
            });
    }

    getCurrentLine() {
        this.currentLine = this.navParams.get('currentLine');
        if(this.currentLine == undefined) {
            this.mode = 'add';
            this.currentLine = new OrderLine(
                null,
                this.product,
                this.category,
                MenuPage.sIngredients,
                MenuPage.sSizes
            );
        } else {
            this.mode = 'edit';
        }
    }

    buildSizesCheckboxes() {
        if(!this.category.isPizzaCategory()) return;

        this.product.sizes.forEach(size => {
            if(size.price <= 0){
                return;
            }

            let sizeName = '-';
            try {
                sizeName = MenuPage.sSizes.find(s => s.code == size.code).name;
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
    }

    buildIngredientsCheckboxes() {
        if(!this.category.isPizzaCategory()) return;

        this.product.ingredients.forEach(ingredient => {
            try {
                let checked: boolean = false;

                if(this.currentLine.ingredientsToRemove.indexOf(ingredient) < 0) {
                    checked = true;
                }

                let ingredientComplete = MenuPage.sIngredients.find(i => i.id == ingredient);
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

        MenuPage.sIngredients.forEach(ingredient => {
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

        let max: number = MenuPage.sConfig["ingredients-max-remove"];
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

        let max: number = MenuPage.sConfig["ingredients-max-add"];
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

    setHalf() {
        this.navCtrl.push(HalfPizzaPage, {
            halfPizzaId: this.product.id,
            pizzaSize: this.currentLine.size
        });
    }

    addLineToOrder() {
        this.currentLine.setOrder(CartPage.order);
        CartPage.order.addLine(this.currentLine);
        this.goCart();
    }

    editLine() {
        this.goCart();
    }

    goCart() {
        this.navCtrl.push(CartPage);
    }
}
