import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoryService } from '../service/category.service';
import { Category } from '../models/category.model';
import { IngredientService } from '../service/ingredient.service';
import { Ingredient } from '../models/ingredient.model';
import { ConfigService } from '../service/config.service';
import { ProductService } from '../service/product.service';
import { Size } from '../models/size.model';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  static sCategories: Category[] = [];
  static sIngredients: Ingredient[] = [];
  static sConfig: any = {};
  static sSizes: Size[] = [];
  static isOpen: boolean = true;
  categories: Category[] = [];
  holidays: any[] = [];
  order: Order | any = null;
  unds: number = this.order != undefined ? this.order.unds : 0;
  user: User | any = null;


  //STORAGE
  categories_storage: Category[] = [];
  ingredients_storage: Ingredient[] = [];
  sizes_storage: Size[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
    private configService: ConfigService,
    private productService: ProductService,
    private alertController: AlertController) {}

  ngOnInit() {
    this.getCategories();
  }

  ionViewDidLoad() {
    if (this.order == undefined) {
      this.order = new Order();
    }
    this.getCategories();

    this.user = this.userService.getUser();
    if (this.user && !this.user.isLogged()) {
      this.alertController
        .create({
          header: 'ATENCIÓN',
          message:
            'Por favor, accede cuanto antes a editar tus datos personales y cambia tu contraseña. Gracias.',
          buttons: [
            {
              text: 'Ok, más tarde lo hago',
            },
            {
              text: 'Venga, llévame a cambiarla',
              handler: () => {
                //this.navCtrl.push(UserPage);
                this.router.navigate(['/user']);
              },
            },
          ],
        })
        .then(alert => alert.present());
    }

  }

  ionViewDidEnter() {
    this.getIngredients();
    this.getConfig();
    this.getSizes();
    this.checkIfIsOpen();

    this.refreshCartUnds();
  }

  refreshCartUnds() {
    if(this.order != undefined && this.order.unds != null) {
      this.unds = this.order.unds ? this.order.unds : 0;
    }
  }

  async getCategories() {
    (await this.categoryService.findAll()).subscribe(
      (data: any) => {
        this.categories = [];
        //MenuPage.sCategories = [];
        data.forEach((d: any) => {
          let category: Category = new Category(d.id, d.name, d.type, d.order);
          this.categories.push(category);
          //MenuPage.sCategories.push(category);
        });
        this.saveCategories(this.categories); // Guarda las categorías en Storage
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getIngredients() {
    this.ingredientService.findAll().subscribe(
      (data: any) => {
        //MenuPage.sIngredients = [];
        data.forEach((i: any) => {
          let ingredient: Ingredient = new Ingredient(
            i.id,
            i.name,
            i.active,
            i.available,
            i.price,
            i.base
          );
          //MenuPage.sIngredients.push(ingredient);
          this.ingredients_storage.push(ingredient);
        });
        this.saveIngredients(this.ingredients_storage); // Guarda los ingredientes en Storage
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getConfig() {
    this.configService.findAll().then(
      (data: any) => {
        MenuPage.sConfig = data;
        this.saveConfig(data); // Guarda la configuración en Storage
      },
      (error) => {
        console.error(error);
      }
    );
  }

  checkIfIsOpen() {
    this.configService.isOpen().then(
      (data: any) => {
        this.holidays = data;

        if (this.holidays.length > 0) {
          MenuPage.isOpen = false;

          let holidaysPopUp = localStorage.getItem('holidaysPopUp');

          if (
            holidaysPopUp == undefined ||
            Date.now() - parseInt(holidaysPopUp) > 10000
          ) {
            this.showHoliDaysPopUp(
              this.holidays[0].dateTo,
              this.holidays[0].description
            );
            localStorage.setItem('holidaysPopUp', Date.now().toString());
          }
        } else {
          MenuPage.isOpen = true;
          localStorage.removeItem('holidaysPopUp');
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async showHoliDaysPopUp(dateTo: string, description: string) {
    /*
    let profileModal = this.modalCtrl.create(PopupHolidaysPage, {
      opening: dateTo,
      description: description,
    });
    profileModal.present();
    */
    const alert = await this.alertController.create({
      header: 'Holiday Details',
      subHeader: `Opening Date: ${dateTo}`,
      message: description,
      buttons: ['OK']
    });

    await alert.present();
  }

  getSizes() {
    this.productService.getSizes().then(
      (data: any) => {
        //MenuPage.sSizes = [];
        data.forEach((s: any) => {
          let size: Size = new Size(s.code, s.name, s.multiplier);
          //MenuPage.sSizes.push(size);
          this.sizes_storage.push(size);
        });
        this.saveSizes(this.sizes_storage); // Guarda los tamaños en Storage
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  goCategory(categoryId: string, category: string) {
    /*
    this.navCtrl.push(CategoryPage, {
      categoryId: categoryId,
      category: category,
    });
    */
    this.router.navigate(['/category', categoryId, category]);
  }

  goCart() {
    //this.navCtrl.push(CartPage);
    this.router.navigate(['/cart']);
  }

  openMenu() {
    //this.menuCtrl.open();
  }

  async saveCategories(categories: Category[]) {
    const categoriesString = JSON.stringify(categories);
    await Preferences.set({
      key: 'categories',
      value: categoriesString,
    });
  }

  async saveIngredients(ingredients: Ingredient[]) {
    const ingredientsString = JSON.stringify(ingredients);
    await Preferences.set({
      key: 'ingredients',
      value: ingredientsString,
    });
  }

  async saveSizes(sizes: Size[]) {
    const sizesString = JSON.stringify(sizes);
    await Preferences.set({
      key: 'sizes',
      value: sizesString,
    });
  }

  async saveConfig(config: any) {
    const configString = JSON.stringify(config);
    await Preferences.set({
      key: 'config',
      value: configString,
    });
  }
}
