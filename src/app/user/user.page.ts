import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { CodePage } from '../code/code';
import { User } from '../../models/user.model';
import { RegisterPage } from '../register/register';
import { UserForm } from '../../models/userForm.model';
import { Utils } from '../../utils/utils';
import { MenuPage } from '../menu/menu';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  myUser: User = this.userService.getUser();
  userForm: UserForm;

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    if (!this.userService.isLogged()) {
      this.navCtrl.setRoot(RegisterPage);
      return;
    } else if (this.userService.isWaitingForCode()) {
      this.navCtrl.setRoot(CodePage);
    }

    this.userForm = {
      id: this.myUser.id,
      name: this.myUser.name,
      login: this.myUser.login,
      address: this.myUser.address,
      zip: this.myUser.zip,
      birthDate: this.myUser.birthDate,
      password: '',
      repeated: '',
    };
  }

  checkUserData() {
    let msg = '';

    if (this.userForm.birthDate === '') {
      msg = 'La fecha de nacimiento no puede estar vacía';
    }

    if (this.userForm.login === '') {
      msg = 'El email es requerido';
    }

    if (this.userForm.name === '') {
      msg = 'El nombre es requerido';
    }

    if (this.userForm.password != '') {
      try {
        Utils.checkPassword(this.userForm.password, this.userForm.repeated);
      } catch (e) {
        msg = e;
      }
    }

    if (msg !== '') {
      this.alertController
        .create({
          title: 'Error',
          message: msg,
          buttons: ['OK'],
        })
        .present();
      return;
    }

    return true;
  }

  public updateUser() {
    if (!this.checkUserData()) return;

    this.userService.updateUser(this.userForm).subscribe(
      (user: User) => {
        this.alertController
          .create({
            title: 'Datos actualizados',
            message: 'Tus datos de usuario han sido actualizados',
            buttons: ['OK'],
          })
          .present();

        this.myUser.name = this.userForm.name;
        this.myUser.login = this.userForm.login;
        this.myUser.address = this.userForm.address;
        this.myUser.birthDate = this.userForm.birthDate;

        this.myUser.setLogged(true);

        this.userService.storeUserData(this.myUser);

        this.userForm.password = '';
        this.userForm.repeated = '';
      },
      (error) => {
        this.alertController
          .create({
            title: 'Error',
            message:
              'Ha ocurrido un error al actualizar tus datos, inténtalo de nuevo más tarde',
            buttons: ['OK'],
          })
          .present();
      }
    );
  }

  removeUser() {
    this.alertController
      .create({
        title: 'ATENCIÓN',
        message:
          'Vas a solicitar eliminar tu cuenta de nuestro sistema, por lo que se eliminará todo el historial de pedidos y tus datos de usuario. ¿Estás seguro?',
        buttons: [
          {
            text: 'Ok, adelante',
            handler: () => {
              this.doRemove();
            },
          },
          {
            text: 'Cancelar',
          },
        ],
      })
      .present();
  }

  private doRemove() {
    this.userService.removeUser(this.myUser.id).subscribe(
      (user: User) => {
        this.alertController
          .create({
            title: 'Solicitud enviada',
            message:
              'La solicitud para eliminar tu cuenta de nuestro sistema ha sido recibida correctamente. En breve será eliminada de nuestra base de datos.',
            buttons: ['OK'],
          })
          .present();

        this.userService.removeUserData();

        this.navCtrl.setRoot(MenuPage);
      },
      (error) => {
        this.alertController
          .create({
            title: 'Error',
            message:
              'Ha ocurrido un error al eliminar tu cuenta, Inténtalo de nuevo más tarde',
            buttons: ['OK'],
          })
          .present();
      }
    );
  }
}
