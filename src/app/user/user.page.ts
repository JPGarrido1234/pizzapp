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
  myUser: User | any; // = new User('', 'jpgl@gmail.com', '', 'jp', '', '', '666', '01/01/2024', false, false, false, '');
  userForm: UserForm | any;
  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private router: Router
  ) {}

 ionViewDidLoad() {

  }

  async ionViewDidEnter() {

    // Check if logged
    if (! await this.userService.isLogged()) {
      this.router.navigate(['/register']);
      return;
    } else if (await this.userService.isWaitingForCode()) {
      this.router.navigate(['/code']);
      return;
    }

    // Fetch user data
    this.myUser = await this.userService.getUser();
    if (!this.myUser) {
      throw new Error('User is null');
    }

    this.userForm = {
      id: this.myUser.id,
      name: this.myUser.name,
      login: this.myUser.login,
      address: this.myUser.address,
      zip: this.myUser.zip,
      birthDate: this.myUser.birthDate ? this.myUser.birthDate : '',
      password: '',
      repeated: '',
    };

    /*
    if (this.userForm.birthDate) {
      const formattedDate = this.formatDate(this.userForm.birthDate);
      console.log('Formatted date', formattedDate);
      this.userForm.birthDate = formattedDate;
    }
    */
  }

  async checkUserData() {
    let msg: any = '';

    /*
    if (this.userForm.birthDate === '') {
      msg = 'La fecha de nacimiento no puede estar vacía';
    }
    */


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

    let birthDay = this.userForm.birthDate;
    const formattedDate = this.formatDate(birthDay);
    this.userForm.birthDate = formattedDate;

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
        this.myUser.zip = this.userForm.zip;
        if (this.userForm.birthDate != '') {
          this.myUser.birthDate = this.userForm.birthDate;
        }

        //console.log('User updated', this.myUser);
        this.myUser.logged = true;

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

  parseDate(date: string): Date | null {
    const parts = date.split('-'); // Split the date by the hyphen (-)
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
      const year = parseInt(parts[2], 10);

      const parsedDate = new Date(year, month, day); // Create Date object

      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Return null if invalid date
    return null;
  }

  // Function to format the date input to YYYY-MM-DD format
  formatDate(date: string): string {
    const formattedDate = this.parseDate(date);

    if(formattedDate) {

      const day = formattedDate.getDate().toString().padStart(2, '0'); // Get day with leading zero
      const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
      const year = formattedDate.getFullYear(); // Get the full year

      return `${year}-${month}-${day}`; // Format as DD-MM-YYYY
    }

    return '';
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
    this.userService.removeUser(this.myUser.id).subscribe(
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
