import { Component, OnInit } from '@angular/core'
import { AlertController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type loginData = {
  login: string;
  password: string;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  error_msg: string = '';
  disable: boolean = false;
  loginForm: loginData = { login: '', password: '' };
  loginData: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService
  ) {

  }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    if (await this.userService.isLogged()) {
      this.userService.logOut()
    } else if (await this.userService.isWaitingForCode()) {
      //this.navCtrl.setRoot(CodePage)
      this.router.navigate(['/code']);
    }
  }

  async login() {
      this.userService.login(this.loginForm.login, this.loginForm.password)
      .subscribe(
        async (data: any) => {
          let user: User;
          try {
            user = User.populate(data);
            console.log('USER2: '+user);
          } catch (e: any) {
            const alert = await this.alertController.create({
              message: e,
              buttons: ['OK'],
            });
            await alert.present();
            return;
          }

          if (!user.isActive()) {
            const alert = await this.alertController
              .create({
                message:
                  'El usuario se encuentra en proceso de eliminación de la aplicación',
                buttons: ['OK'],
              })
              await alert.present();
            return
          }

          user.setLogged(true)

          //this.userService.storeUserData(user);
          this.userService.saveUserKeyStore();
          this.userService.saveUserStore(user);

          if (!user.codeValidated) {
            //this.navCtrl.setRoot(CodePage)
            this.router.navigate(['/code']);
          } else {
            //this.navCtrl.setRoot(MenuPage)
            this.router.navigate(['/menu']);
          }
        },
        async (err) => {
          const alert = await this.alertController
            .create({
              message: 'Email y/o contraseña incorrectos',
              buttons: ['OK'],
            })
          await alert.present();
        },
      )
  }

  public goToRegister() {
    //this.navCtrl.push(RegisterPage)
    this.router.navigate(['/register']);
  }

  async sendPasswordSMS() {
    if (this.loginForm.login === '') {
      const alert = await this.alertController
        .create({
          message: 'El email no puede estar vacío',
          buttons: ['OK'],
        })
        await alert.present()
      return
    }

    const alert = await this.alertController
      .create({
        message: 'Vas a reiniciar tu contraseña, ¿estás seguro?',
        // buttons: ['OK', 'Cancelar'],
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log(this.loginForm.login);
              this.userService.sendPassword(this.loginForm.login).subscribe(
                async () => {
                    const alert = await this.alertController
                    .create({
                      message:
                        'Nueva contraseña enviada a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
                      buttons: ['OK'],
                    })
                    await alert.present();
                },
                async (err) => {
                  let message =
                    'No se pudo enviar el código de verificación, inténtalo de nuevo más tarde'

                  if (err.error.toLowerCase().indexOf('found') > -1) {
                    message =
                      'El email introducido no existe en la app'
                  } else if (err.error.toLowerCase().indexOf('unique') > -1) {
                    message =
                      'Hay un problema con el email proporcionado. Contacta con el administrador.'
                  }

                  const alert = await this.alertController
                    .create({
                      message,
                      buttons: ['OK'],
                    })
                  await alert.present()
                },
              )
            },
          },
          { text: 'Cancelar' },
        ],
      })
      await alert.present()
  }
}
