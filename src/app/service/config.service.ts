import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utils } from '../../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(
    private http: HttpClient
) { }

public findAll() {
    const url = environment.API_URL + '/config';
    return this.http.get(url, Utils.getHeaders());
}

public isOpen(){
    const url = environment.API_URL + '/isopen';
    return this.http.get(url, Utils.getHeaders());
}
}
