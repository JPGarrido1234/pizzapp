import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { User } from '../models/user.model'; // Adjust the path as necessary
import { UserForm } from '../models/userForm.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  appStoreUserKey: string = 'riccoriccoUserStore'

  constructor(private http: HttpClient) {
  }

  async register(user: User): Promise<Observable<any>> {
    const url = environment.API_URL + '/register'
    return this.http.post(url, user, Utils.getHeaders())
  }

  async checkCode(phone: string, code: string): Promise<Observable<any>> {
    const url =
      environment.API_URL + '/checkcode?phone=' + phone + '&code=' + code
    return this.http.get(url, Utils.getHeaders())
  }

  async resendCode(phone: string): Promise<Observable<any>> {
    const url = environment.API_URL + '/resendcode?phone=' + phone
    return this.http.get(url, Utils.getHeaders())
  }

  async storeUserData(user: User) {
    localStorage.setItem(this.appStoreUserKey, JSON.stringify(user))
  }

  async removeUserData() {
    localStorage.removeItem(this.appStoreUserKey)
  }

  async getUser() {
    let data: any;
    try {
      const storedData = localStorage.getItem(this.appStoreUserKey);
      if (storedData) {
        data = JSON.parse(storedData);
      } else {
        data = null; // O cualquier valor predeterminado que desees usar
      }
    } catch (error) {
      console.error('Error parsing JSON from localStorage', error);
      data = null; // O cualquier valor predeterminado que desees usar
    }
  }

  public isLogged() {
    try {
      //let user: User = this.getUser()
      let user: any;
      if (user == null) return false
      return user.codeValidated
    } catch (e) {
      return false
    }
  }

  public isWaitingForCode() {
    try {
      //let user: User = this.getUser()
      let user: any;
      if (user == null) return false
      return !user.codeValidated
    } catch (e) {
      return false
    }
  }

  public logOut() {
    try {
      localStorage.removeItem(this.appStoreUserKey)
    } catch (e) {
    }
  }

  public isManager() {
    try {
      //let user: User = this.getUser()
      let user: any;
      if (user == null) return false

      //let ordersAdminKey = MenuPage.sConfig['orders-admin-key']
      let ordersAdminKey;
      if (user.name.indexOf(ordersAdminKey) > 0) {
        return true
      }
    } catch (e) {
    }
    return false
  }

  async login(login: string, password: string): Promise<Observable<any>> {
    const url = environment.API_URL + '/login'
    return this.http.post(url, { login: login, password: password })
  }

  async sendPassword(email: string): Promise<Observable<any>> {
    const url = environment.API_URL + '/generatepassword?login=' + email
    return this.http.get(url)
  }

  async updateUser(userForm: UserForm): Promise<Observable<any>> {
    const url = environment.API_URL + '/userdata'
    return this.http.post(url, userForm, Utils.getHeaders())
  }

  async getOrders(userId: string): Promise<Observable<any>> {
    const url = environment.API_URL + '/userorders?userId=' + userId
    return this.http.get(url, Utils.getHeaders())
  }

  async removeUser(userId: string): Promise<Observable<any>> {
    const url = environment.API_URL + '/unsuscribe?userId=' + userId
    return this.http.get(url, Utils.getHeaders())
  }
}
