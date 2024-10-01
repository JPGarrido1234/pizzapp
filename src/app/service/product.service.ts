import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private http: HttpClient
    ) { }

    async findAll(category: string): Promise<Observable<any>>{
        const url = environment.API_URL + '/products/category/' + category;
        return this.http.get(url, Utils.getHeaders());
    }

    async findById(productId: string): Promise<Observable<any>> {
        const url = environment.API_URL + '/products/' + productId;
        return this.http.get(url, Utils.getHeaders());
    }

    async getImageUrl(productId: string): Promise<Observable<any>> {
        const url = environment.API_URL + '/products/' + productId + '/image';
        return this.http.get(url, Utils.getHeaders());
    }

    async getSizes(): Promise<Observable<any>> {
        const url = environment.API_URL + '/sizes';
        return this.http.get(url, Utils.getHeaders());
    }
}
