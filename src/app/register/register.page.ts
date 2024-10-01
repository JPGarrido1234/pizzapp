import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CodePage } from '../code/code';
import { LoginPage } from '../login/login';
import { Utils } from '../../utils/utils';

type UserRegister = {
  name: string;
  address: string;
  zip: string;
  phone: string;
  login: string;
  password: string;
  passwordRepeated: string;
  birthDate: string;
};

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: UserRegister = {
    name: '',
    address: '',
    zip: '',
    phone: '',
    login: '',
    password: '',
    passwordRepeated: '',
    birthDate: '',
  };

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    if (this.userService.isLogged()) {
      this.userService.logOut();
    } else if (this.userService.isWaitingForCode()) {
      this.navCtrl.setRoot(CodePage);
    }
  }

  public register() {
    try {
      Utils.checkPassword(
        this.registerForm.password,
        this.registerForm.passwordRepeated
      );
    } catch (e) {
      this.presentAlert(e);
      return;
    }

    let user: User;

    try {
      user = User.populate(this.registerForm);
    } catch (e) {
      this.presentAlert(e);
      return;
    }
    this.userService.register(user).subscribe(
      (data: any) => {
        const user = User.populate(data);
        user.setLogged(true);
        this.userService.storeUserData(user);
        this.navCtrl.setRoot(CodePage);
      },
      (e) => {
        let msg = e.error.toLowerCase();
        if (msg.indexOf('duplicate') > 0) {
          if (msg.indexOf('email') > 0) {
            this.presentAlert(
              'El email proporcionado ya está en uso en la app. Intenta loguearte desde el botón de abajo.'
            );
          } else if (msg.indexOf('phone') > 0) {
            this.presentAlert(
              'El teléfono proporcionado ya está en uso en la app. Intenta loguearte desde el botón de abajo.'
            );
          }
        } else {
          this.presentAlert(
            'Error intentando registrar los datos, por favor inténtalo de nuevo más tarde'
          );
        }
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

  public goToLogin() {
    this.navCtrl.push(LoginPage);
  }
}
