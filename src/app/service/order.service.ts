import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private order: Order = new Order();
  private data: any;

  constructor(
    private http: HttpClient
  ) { }

  public post(order: Order) {
      const url = environment.API_URL + '/orders';
      return this.http.post(url, order, Utils.getHeaders());
  }

  public gaps(unds: number) {
      const url = environment.API_URL + '/gaps/' + unds + '?ngsw-bypass=true';
      return this.http.get(url, Utils.getHeaders());
  }

  //ORDER

  setOrder(order: Order): void {
    this.order = order;
  }

  getOrder(): Promise<Order> {
    return new Promise((resolve, reject) => {
      if (this.order !== null) {
        resolve(this.order);
      } else {
        this.order = new Order();
        resolve(this.order);
      }
    });
  }

}
