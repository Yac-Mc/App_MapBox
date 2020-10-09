import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceMapService {

  constructor( private http: HttpClient) { }

  getDataMap(){
    return this.http.get(`${environment.url}/map`);
  }
}
