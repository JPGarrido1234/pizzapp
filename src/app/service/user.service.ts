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

  public register(user: User) {
    const url = environment.API_URL + '/register'
    return this.http.post(url, user, Utils.getHeaders())
  }

  public checkCode(phone: string, code: string) {
    const url =
      environment.API_URL + '/checkcode?phone=' + phone + '&code=' + code
    return this.http.get(url, Utils.getHeaders())
  }

  public resendCode(phone: string) {
    const url = environment.API_URL + '/resendcode?phone=' + phone
    return this.http.get(url, Utils.getHeaders())
  }

  public storeUserData(user: User) {
    localStorage.setItem(this.appStoreUserKey, JSON.stringify(user))
  }

  public removeUserData() {
    localStorage.removeItem(this.appStoreUserKey)
  }

  async getUser() {
    try {
      //let data: any = JSON.parse(localStorage.getItem(this.appStoreUserKey))
      let data: any;
      return User.populate(data)
    } catch (e) {
      return null
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

  public login(login: string, password: string) {
    const url = environment.API_URL + '/login'
    return this.http.post(url, { login: login, password: password })
  }

  public sendPassword(email: string) {
    const url = environment.API_URL + '/generatepassword?login=' + email
    return this.http.get(url)
  }

  public updateUser(userForm: UserForm) {
    const url = environment.API_URL + '/userdata'
    return this.http.post(url, userForm, Utils.getHeaders())
  }

  public getOrders(userId: string) {
    const url = environment.API_URL + '/userorders?userId=' + userId
    return this.http.get(url, Utils.getHeaders())
  }

  removeUser(userId: string) {
    const url = environment.API_URL + '/unsuscribe?userId=' + userId
    return this.http.get(url, Utils.getHeaders())
  }
}
