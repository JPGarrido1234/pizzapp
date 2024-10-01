import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export class Utils {
  static getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' + btoa(environment.USER + ':' + environment.PASSWORD),
      }),
    };
  }

  static validateEmail(email: any) {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static validatePhone(phone: any) {
    return /^\d{9}$/.test(phone);
  }

  static checkPassword(password: String, repeatPassword: String): void {
    if (password === '') {
      throw 'El campo contraseña no puede estar vacío';
    }

    if (password.length < 8) {
      throw 'La contraseña debe tener al menos 8 caracteres';
    }

    if (password !== repeatPassword) {
      throw 'Las contraseñas no coinciden';
    }
  }
}
