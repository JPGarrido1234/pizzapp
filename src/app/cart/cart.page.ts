import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Order } from '../models/order.model';
import { OrderLine } from '../models/orderline.model';
import { OrderService } from '../service/order.service';
import * as moment from 'moment';
import { Gap } from '../models/gap.model';
import { Utils } from '../../utils/utils';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit {
  order: Order | any = null;
  //@ViewChild('navbar') navBar: Navbar;
  currentOrder: Order = new Order();
  numProductsOverload: boolean = false;

  pickupTime: string = '';
  gaps: Gap[] = [];
  orderInProccess: boolean = false;
  isManager: boolean = false;
  user: User | any = null;
  intervalId: any;
  previousUrl: string | null = null;
  lines: OrderLine[] = [];

  //STORAGE
  config_storage: any = {};

  constructor(
    private orderService: OrderService,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private platform: Platform
  ) {}


  async ngOnInit() {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });

    this.platform.ready().then(() => {
      // Escuchar el evento del botón 'Atrás'
      App.addListener('backButton', () => {
          window.history.back();  // Retrocede en el historial de navegación
      });
    });


    try {
      // Check if logged
      if (await this.userService.isWaitingForCode()) {
        this.router.navigate(['/code']);
        return;
      } else if (!(await this.userService.isLogged())) {
        this.router.navigate(['/register']);
        return;
      }

      // Fetch user data
      this.user = await this.userService.getUser();
      if (!this.user) {
        throw new Error('User is null');
      }

      // Additional initialization logic here
      console.log('User: ', this.user);
      this.getCurrentOrder();
      this.isManager = await this.userService.isManager();

      if (this.currentOrder) {
        this.currentOrder.email = this.user?.login;
        if (!this.isManager) {
          this.currentOrder.name = this.user?.name;
          this.currentOrder.phone = this.user?.phone;
        } else {
          this.currentOrder.name = '';
          this.currentOrder.phone = '';
        }
      } else {
        console.error('currentOrder is null');
      }

      this.getGaps();
      this.intervalId = setInterval(() => {
        // Lógica del intervalo
      }, 1000);
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.router.navigate(['/register']);
    }

  }

  ionViewDidLoad() {
    console.log('Order: ', this.order);
  }

  async ionViewDidEnter() {
    // check if logged

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });

    try {
      // Check if logged
      if (await this.userService.isWaitingForCode()) {
        this.router.navigate(['/code']);
        return;
      } else if (!(await this.userService.isLogged())) {
        this.router.navigate(['/register']);
        return;
      }

      // Fetch user data
      this.user = await this.userService.getUser();
      if (!this.user) {
        throw new Error('User is null');
      }

      // Additional initialization logic here
      console.log('User: ', this.user);
      this.getCurrentOrder();
      this.isManager = await this.userService.isManager();

      if (this.currentOrder) {
        this.currentOrder.email = this.user?.login;
        if (!this.isManager) {
          this.currentOrder.name = this.user?.name;
          this.currentOrder.phone = this.user?.phone;
        } else {
          this.currentOrder.name = '';
          this.currentOrder.phone = '';
        }
      } else {
        console.error('currentOrder is null');
      }

      this.getGaps();
      this.intervalId = setInterval(() => {
        // Lógica del intervalo
      }, 1000);
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.router.navigate(['/register']);
    }


  }

  ionViewDidLeave() {
    clearInterval(this.intervalId);
  }

  getCurrentOrder() {
    let total = 0;
    let unds = 0;
    this.orderService.getOrder().then((order: any) => {
      this.order = order;

      if(this.order == null) {
        this.order = new Order();
      }

      if(this.user != undefined) {
        this.order.userId = this.user.id;
      }

      this.order.lines.forEach((line: any) => {
        if(line.product !== undefined){
          total += line.priceTotal;
          unds += line.und;
        }
      });

      this.currentOrder = this.order;
      this.currentOrder.total = total;
      this.currentOrder.unds = unds;
      console.log('CURRENT ORDER: ', this.currentOrder);
    });
  }

  getGaps() {
    this.numProductsOverload = false;
    this.loadConfig().then(() => {
      if(this.currentOrder != undefined) {
        if (this.getPizzasUnd() > this.config_storage['products-per-gap']) {
          this.numProductsOverload = true;
          return;
        }

        this.orderService.gaps(this.getPizzasUnd()).subscribe(
          (data: any) => {
            this.gaps = data;
          },
          (error) => {
            console.error(error);
            alert('[ERROR] ' + error.message);
          }
        );
      }
    });

  }

  getPizzasUnd() {
    let unds = 0;
    this.order.lines.forEach((line: any) => {
      if (line.pizza) {
        unds += line.half ? 0.5 : line.und;
      }
    });
    return parseInt(unds.toString());
  }

  removeUnd(line: OrderLine) {
    line.removeUnd();
    this.getGaps();
  }

  addUnd(line: OrderLine) {
    this.pickupTime = '';
    line.addUnd();
    this.getGaps();
  }
/*
  removeLine(line: OrderLine) {
    this.pickupTime = '';
    console.log(this.currentOrder);
    this.currentOrder.removeLine(line);
    this.getGaps();
  }
*/

  removeLine(line: OrderLine) {
    let unds = 0;
    let total = 0;
    let newLines: any = [];
    this.order.lines.forEach((l: any) => {
      if (l.id != line.id) {
        newLines.push(l);
      }
    });
    this.order.lines = newLines;
    this.order.lines.forEach((line: any) => {
      if(line.product !== undefined){
        total += line.priceTotal;
        unds += line.und;
      }
    });
    this.currentOrder.removeLine(line);
    this.currentOrder.total = total;
    this.currentOrder.unds = unds;
  }

  goCheckout() {
    if (!this.canDoOrder()) {
      this.presentAlert('Ya has alcanzado el número máximo de pedidos por día');
      return;
    }


    if (!this.orderReady()) {
      return;
    }

    this.currentOrder.pickupTime = this.pickupTime;

    try {
      this.currentOrder.isOk();
    } catch (e) {
      this.presentAlert(String(e));
      return;
    }

    let order = this.currentOrder.prepareToPost();

    this.orderInProccess = true;

    this.orderService.post(order).subscribe(
      () => {
        this.addOrderPerDay();

        this.order.clear();
        this.currentOrder.clear();

        this.showPopup();
      },
      (error) => {
        this.orderInProccess = false;
        alert('Ups! ' + error.error);
      }
    );
  }

  showPopup() {
    /*
    let profileModal = this.modalCtrl.create(PopupSuccessPage, {
      pickupTime: moment(parseInt(this.pickupTime) * 1000).format('HH:mm'),
    });

    profileModal.present().then((r) => {
      setTimeout(() => {
        profileModal.dismiss().then((r: any) => {
          //this.navCtrl.setRoot(MenuPage);
          this.router.navigate(['/menu']);
        });
      }, 60 * 1000);
    });
    */
    this.presentSuccessAlert();
  }

  async canDoOrder(): Promise<boolean> {
    try {
      const sUserOrders = await this.loadUserOrders();
      if (sUserOrders != undefined) {
        const userOrders = JSON.parse(sUserOrders);
        const max: number = this.config_storage['orders-max'];

        if (this.isManager) {
          return true;
        }

        if (Date.now() - userOrders.date < 86400 * 1000) {
          if (userOrders.num >= max) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error loading user orders:', error);
      return false;
    }
  }

  addOrderPerDay() {
    //let sUserOrders = localStorage.getItem('userOrders');
    this.loadUserOrders().then((sUserOrders) => {
      let userOrders: any;
      if (sUserOrders == undefined) {
        userOrders = {
          num: 1,
          date: Date.now(),
        };
      } else {
        userOrders = JSON.parse(sUserOrders);
        if (Date.now() - userOrders.date < 86400 * 1000) {
          userOrders.num += 1;
        } else {
          userOrders = {
            num: 1,
            date: Date.now(),
          };
        }
      }

      this.saveUserOrders(userOrders);
    });

    //localStorage.setItem('userOrders', JSON.stringify(userOrders));
  }

  orderReady() {
    if (this.isManager) {
      return (
        this.currentOrder.name != '' &&
        this.currentOrder.phone != '' &&
        this.pickupTime != ''
      );
    }
    return (
      this.currentOrder.name != '' &&
      this.currentOrder.phone != '' &&
      Utils.validatePhone(this.currentOrder.phone) &&
      this.currentOrder.email != '' &&
      Utils.validateEmail(this.currentOrder.email) &&
      this.pickupTime != ''
    );

  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Pedido enviado',
      message: `Hora de recogida: ${moment(parseInt(this.pickupTime) * 1000).format('HH:mm')}`,
      buttons: [{
        text: 'OK',
        handler: () => {
          setTimeout(() => {
            alert.dismiss();
            this.router.navigate(['/menu']);
          }, 60 * 1000);
        }
      }]
    });

    await alert.present();
  }

  editLine(line: OrderLine) {
    if (line.isHalfAndHalf) {
      return;
    }
    /*
    this.navCtrl.push(ProductPage, {
      productId: line.productId,
      currentLine: line,
    });
    */
    this.router.navigate(['/product', line.productId, line]);
   //this.router.navigate(['/product', {productId: line.productId, currentLine: line}]);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async loadConfig() {
    const { value } = await Preferences.get({ key: 'config' });
    if (value) {
      this.config_storage = JSON.parse(value);
      console.log('CONFIG: ', this.config_storage);
    }
  }

  async saveUserOrders(userOrders: any) {
    const userOrdersPref = JSON.stringify(userOrders);
    await Preferences.set({
      key: 'userOrders',
      value: userOrdersPref,
    });
  }

  async loadUserOrders() {
    const { value } = await Preferences.get({ key: 'userOrders' });
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

}
