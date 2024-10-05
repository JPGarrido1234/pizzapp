import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { User } from '../models/user.model'; // Adjust the path as necessary
import { UserForm } from '../models/userForm.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null;
  appStoreUserKey: string = 'riccoriccoUserStore'

  //STORE
  config_storage: any = {};

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
    //localStorage.setItem(this.appStoreUserKey, JSON.stringify(user));
    //usar preferences para guardar el usuario
    this.saveUserKeyStore();
    this.saveUserStore(user);
  }


  async removeUserData() {
    //localStorage.removeItem(this.appStoreUserKey)
    this.removeUserKeyStore();
    this.removeUserStore();
  }

  getUser() {
    return new Promise((resolve, reject) => {
      this.loadUserStore().then((user: any) => {
        try {
          const storedData = user;
          let data = JSON.parse(storedData);
          if (data) {
            console.log('Data: ', data);
            resolve(data);
          } else {
            //reject('User not found');
            data = null;
          }
        } catch (error) {
          console.error('Error parsing JSON from localStorage', error);
          reject('Error parsing user data');
        }
      }).catch(error => {
        console.error('Error loading user from store', error);
        reject('Error loading user from store');
      });
    });
  }

  async isLogged() {
    try {
      let user: User = await this.getUser() as User;
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
      //localStorage.removeItem(this.appStoreUserKey)
      this.removeUserKeyStore();
      this.removeUserStore();
    } catch (e) {
    }
  }

  public async isManager() {
    try {
      let user: User = await this.getUser() as User;
      if (user == null) return false

      let ordersAdminKey = this.config_storage['orders-admin-key']
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

  async saveUserKeyStore(){
    const userString = JSON.stringify(this.appStoreUserKey);
    await Preferences.set({
      key: 'userkey',
      value: userString,
    });
  }

  async saveUserStore(user: User) {
    const userString = JSON.stringify(user);
    await Preferences.set({
      key: 'user',
      value: userString,
    });
  }

  async removeUserKeyStore(){
    await Preferences.remove({ key: 'userkey' });
  }

  async removeUserStore(){
    await Preferences.remove({ key: 'user' });
  }

  async loadUserStore(): Promise<User | null> {
    const userString = await Preferences.get({ key: 'user' });
    if (userString.value) {
      return JSON.parse(userString.value);
    }
    return null;
  }

  async loadUserKey(): Promise<User | null> {
    const userString = await Preferences.get({ key: 'userkey' });
    if (userString.value) {
      return JSON.parse(userString.value);
    }
    return null;
  }

  async loadConfig() {
    const { value } = await Preferences.get({ key: 'config' });
    if (value) {
      this.config_storage = JSON.parse(value);
    }
  }
}
