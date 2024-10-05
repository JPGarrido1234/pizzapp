import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Order } from '../models/order.model';
import { OrderLine } from '../models/orderline.model';
import { OrderService } from '../service/order.service';
import * as moment from 'moment';
import { Gap } from '../models/gap.model';
import { Utils } from '../../utils/utils';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

export class CartPage implements OnInit {
  order: Order | any = null;
  //@ViewChild('navbar') navBar: Navbar;
  currentOrder: Order | any = null;
  numProductsOverload: boolean = false;

  pickupTime: string = '';
  gaps: Gap[] = [];
  isOpen: boolean = true;
  orderInProccess: boolean = false;
  isManager: boolean = false;
  user: User | any = null;
  intervalId: any;
  previousUrl: string | null = null;

  //STORAGE
  config_storage: any = {};

  constructor(
    private orderService: OrderService,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService
  ) {}


  async ngOnInit(): Promise<void> {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });

    // check if logged
    if (this.userService.isWaitingForCode()) {
      //this.navCtrl.setRoot(CodePage);
      this.router.navigate(['/code']);
      return;
    } else if (!this.userService.isLogged()) {
      //this.navCtrl.setRoot(RegisterPage);
      this.router.navigate(['/register']);
      return;
    }

    this.userService.getUser().then((user: any) => {
      this.user = user;
    });

    this.getCurrentOrder();
    this.isManager = await this.userService.isManager();

    console.log('USER: ', this.user);
    if (this.currentOrder) {
      this.currentOrder.email = this.user?.login;
      if (!this.isManager) {
        this.currentOrder.name = this.user?.name;
        this.currentOrder.phone = this.user?.phone;
      } else {
        this.currentOrder.name = '';
        this.currentOrder.phone = '';
      }
    }

    this.getGaps();
    this.intervalId = setInterval(() => {
      this.getGaps();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('Order: ', this.order);
  }

  async ionViewDidEnter() {
    // check if logged
    if (this.userService.isWaitingForCode()) {
      this.router.navigate(['/code']);
      return;
    } else if (!this.userService.isLogged()) {
      this.router.navigate(['/register']);
      return;
    }

    this.userService.getUser().then((user: any) => {
      this.user = user;
    });

    this.getCurrentOrder();
    this.isManager = await this.userService.isManager();


    this.currentOrder.email = this.user?.login;
    if (!this.isManager) {
      this.currentOrder.name = this.user?.name;
      this.currentOrder.phone = this.user?.phone;
    } else {
      this.currentOrder.name = '';
      this.currentOrder.phone = '';
    }

    this.getGaps();
    this.intervalId = setInterval(() => {
      this.getGaps();
    }, 2000);
  }

  ionViewDidLeave() {
    clearInterval(this.intervalId);
  }

  getCurrentOrder() {
    this.order = this.orderService.getOrder();
    if (this.order == undefined) {
      this.order = new Order();
    }
    if(this.user != undefined) {
      this.order.userId = this.user.id;
    }
    this.currentOrder = this.order;
    console.log('CURRENT ORDER: ', this.currentOrder);

  }

  getGaps() {
    this.numProductsOverload = false;
    this.loadConfig().then(() => {
      if(this.currentOrder != undefined) {
        if (this.currentOrder.getPizzasUnd() > this.config_storage['products-per-gap']) {
          this.numProductsOverload = true;
          return;
        }

        this.orderService.gaps(this.currentOrder.getPizzasUnd()).subscribe(
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

  removeUnd(line: OrderLine) {
    line.removeUnd();
    this.getGaps();
  }

  addUnd(line: OrderLine) {
    this.pickupTime = '';
    line.addUnd();
    this.getGaps();
  }

  removeLine(line: OrderLine) {
    this.pickupTime = '';
    this.currentOrder.removeLine(line);
    this.getGaps();
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

  canDoOrder() {
    let sUserOrders = localStorage.getItem('userOrders');

    if (sUserOrders != undefined) {
      let userOrders = JSON.parse(sUserOrders);
      //let max: number = MenuPage.sConfig['orders-max'];
      let max: number = 1;

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
  }

  addOrderPerDay() {
    let sUserOrders = localStorage.getItem('userOrders');
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
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
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
      header: 'Success',
      message: `Pickup time: ${moment(parseInt(this.pickupTime) * 1000).format('HH:mm')}`,
      buttons: [{
        text: 'OK',
        handler: () => {
          setTimeout(() => {
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
    }
  }
}
