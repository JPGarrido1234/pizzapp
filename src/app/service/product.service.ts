import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient
    ) { }

    async findAll(category: string): Promise<Product[]>{
        const url = environment.API_URL + '/products/category/' + category;
        return this.http.get<Product[]>(url, Utils.getHeaders()).toPromise() as Promise<Product[]>;
    }

    findById(productId: string): Observable<any> {
        const url = environment.API_URL + '/products/' + productId;
        return this.http.get<Product>(url, Utils.getHeaders());
    }

    getImageUrl(productId: string): Observable<any> {
        const url = environment.API_URL + '/products/' + productId + '/image';
        return this.http.get(url, Utils.getHeaders());
    }

    getSizes() {
        const url = environment.API_URL + '/sizes';
        return this.http.get(url, Utils.getHeaders());
    }

    getProductsByCategory(categoryId: string | null): Observable<Product[]> {
      const url = environment.API_URL + '/category/' + categoryId + '/products';
      return this.http.get<Product[]>(url, Utils.getHeaders() );
    }
}
