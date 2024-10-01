import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

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
}
