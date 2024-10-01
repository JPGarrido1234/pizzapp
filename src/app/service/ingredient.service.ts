import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  constructor(
    private http: HttpClient
) { }

public findAll() {
    const url = environment.API_URL + '/ingredients';
    return this.http.get(url, Utils.getHeaders());
}
}
