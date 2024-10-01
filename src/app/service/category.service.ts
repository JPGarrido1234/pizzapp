import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
) { }

async findAll(): Promise<Observable<any>> {
    const url = environment.API_URL + '/categories';
    return this.http.get(url, Utils.getHeaders());
}
}
