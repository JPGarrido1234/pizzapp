import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CategoryService } from '../service/category.service';
import { Category } from '../models/category.model';
import { IngredientService } from '../service/ingredient.service';
import { Ingredient } from '../models/ingredient.model';
import { ConfigService } from '../service/config.service';
import { ProductService } from '../service/product.service';
import { Size } from '../models/size.model';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';

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
  //unds: number = CartPage.order != undefined ? CartPage.order.unds : 0;
  user: User | any = null;;

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
    //if (CartPage.order == undefined) {
      //CartPage.order = new Order();
    //}
    this.getCategories();
/*
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
              },
            },
          ],
        })
        .then(alert => alert.present());
    }
*/
  }

  ionViewDidEnter() {
    this.getIngredients();
    this.getConfig();
    this.getSizes();
    this.checkIfIsOpen();

    this.refreshCartUnds();
  }

  refreshCartUnds() {
    //this.unds = CartPage.order.unds;
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
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getIngredients() {
    this.ingredientService.findAll().subscribe(
      (data: any) => {
        MenuPage.sIngredients = [];
        data.forEach((i: any) => {
          let ingredient: Ingredient = new Ingredient(
            i.id,
            i.name,
            i.active,
            i.available,
            i.price,
            i.base
          );
          MenuPage.sIngredients.push(ingredient);
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getConfig() {
    this.configService.findAll().subscribe(
      (data: any) => {
        MenuPage.sConfig = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  checkIfIsOpen() {
    this.configService.isOpen().subscribe(
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
      (error) => {
        console.error(error);
      }
    );
  }

  showHoliDaysPopUp(dateTo: string, description: string) {
    /*
    let profileModal = this.modalCtrl.create(PopupHolidaysPage, {
      opening: dateTo,
      description: description,
    });
    profileModal.present();
    */
  }

  getSizes() {
    this.productService.getSizes().subscribe(
      (data: any) => {
        //MenuPage.sSizes = [];
        data.forEach((s: any) => {
          let size: Size = new Size(s.code, s.name, s.multiplier);
          MenuPage.sSizes.push(size);
        });
      },
      (error) => {
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
    this.router.navigate(['/category', categoryId], { queryParams: { name } });
  }

  goPizza() {
    //this.navCtrl.push(PizzamenuPage);
  }

  goCart() {
    //this.navCtrl.push(CartPage);
  }

  openMenu() {
    //this.menuCtrl.open();
  }
}