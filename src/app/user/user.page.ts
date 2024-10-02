import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { UserForm } from '../models/userForm.model';
import { Utils } from '../../utils/utils';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPage {
  myUser: User | any;
  userForm: UserForm | any;
  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private router: Router
  ) {}



  ionViewDidEnter() {
    if (!this.userService.isLogged()) {
      //this.navCtrl.setRoot(RegisterPage);
      this.router.navigate(['/register']);
      return;
    } else if (this.userService.isWaitingForCode()) {
      //this.navCtrl.setRoot(CodePage);
      this.router.navigate(['/code']);
    }

    this.userService.getUser().then((user : any) => {
      this.myUser = user;
    });

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

  async checkUserData() {
    let msg: any = '';

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
        const alert = await this.alertController.create({
          header: 'Error',
          message: msg,
          buttons: ['OK'],
        });

        await alert.present();
      return;
    }

    return true;
  }

  public updateUser() {
    if (!this.checkUserData()) return;

    this.userService.updateUser(this.userForm).then(
      async (user: any) => {
        const alert = await this.alertController.create({
            header: 'Datos actualizados',
            message: 'Tus datos de usuario han sido actualizados',
            buttons: ['OK'],
          });

        await alert.present();

        this.myUser.name = this.userForm.name;
        this.myUser.login = this.userForm.login;
        this.myUser.address = this.userForm.address;
        this.myUser.birthDate = this.userForm.birthDate;

        this.myUser.setLogged(true);

        this.userService.storeUserData(this.myUser);

        this.userForm.password = '';
        this.userForm.repeated = '';
      },
      async (error: any) => {
        const alert = await this.alertController.create({
            header: 'Error',
            message: 'Ha ocurrido un error al actualizar tus datos, inténtalo de nuevo más tarde',
            buttons: ['OK'],
          });

        await alert.present();
      }
    );
  }

  async removeUser() {
    const alert = await this.alertController
      .create({
        header: 'ATENCIÓN',
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
      });
      await alert.present();
  }

  private doRemove() {
    this.userService.removeUser(this.myUser.id).then(
      async (user: any) => {
        const alert = await this.alertController
          .create({
            header: 'Solicitud enviada',
            message:
              'La solicitud para eliminar tu cuenta de nuestro sistema ha sido recibida correctamente. En breve será eliminada de nuestra base de datos.',
            buttons: ['OK'],
          })
          await alert.present();

        this.userService.removeUserData();

        //this.navCtrl.setRoot(MenuPage);
        this.router.navigate(['/menu']);
      },
      async (error) => {
        const alert = await this.alertController
          .create({
            header: 'Error',
            message:
              'Ha ocurrido un error al eliminar tu cuenta, Inténtalo de nuevo más tarde',
            buttons: ['OK'],
          })
          await alert.present();
      }
    );
  }
}
