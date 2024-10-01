import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient
    ) { }

    public findAll(category: string) {
        const url = environment.API_URL + '/products/category/' + category;
        return this.http.get(url, Utils.getHeaders());
    }

    public findById(productId: string) {
        const url = environment.API_URL + '/products/' + productId;
        return this.http.get(url, Utils.getHeaders());
    }

    public getImageUrl(productId: string) {
        const url = environment.API_URL + '/products/' + productId + '/image';
        return this.http.get(url, Utils.getHeaders());
    }

    public getSizes() {
        const url = environment.API_URL + '/sizes';
        return this.http.get(url, Utils.getHeaders());
    }
}
