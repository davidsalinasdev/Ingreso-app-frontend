import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Variables globales
import { environment } from './../../environments/environment';



// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VocacionalService {

  constructor(private http: HttpClient) { }

  /**
 * Store nuevos eventos
 */
  public storeEventos(estudiante: any) {

    // Ahora con interceptores

    return this.http.post<any>(base_url + '/api/vocacional', estudiante);

  }

}
