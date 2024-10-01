import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-code',
  templateUrl: './code.page.html',
  styleUrls: ['./code.page.scss']
})


export class CodePage {
  code: string | any;

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    if (this.userService.isLogged()) {
      //this.navCtrl.setRoot(MenuPage);
    } else if (!this.userService.isWaitingForCode()) {
      //this.navCtrl.setRoot(LoginPage);
    }
  }

  public checkCode() {
    let phone: string = '';
    let user: User | any;
    if (this.code == '') return;
    this.userService.getUser().then((userPhone : any) => {
      phone = userPhone;
    });

    this.userService.checkCode(phone, this.code).subscribe(
      () => {
        this.userService.getUser().then((user : any) => {
          user.codeValidated = true;
          this.userService.storeUserData(user);
          //this.navCtrl.setRoot(MenuPage);
        });
      },
      (e) => {
        this.presentAlert(
          'El código introducido no es corrrecto. Por favor, inténtalo de nuevo'
        );
      }
    );
  }

  public reSendCode() {
    let phone: string = '';
    this.userService.getUser().then((user : any) => {
      phone = user.phone;
    });

    this.userService.resendCode(phone).subscribe(
      () => {
        this.presentAlert(
          'Te hemos enviado un nuevo código, intenta introducirlo ahora'
        );
      },
      () => {
        this.presentAlert(
          'Error al solicitar el nuevo código. Por favor, inténtalo de nuevo más tarde'
        );
      }
    );
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
