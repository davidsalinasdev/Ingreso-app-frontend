import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// El tap dispara un efecto secundario
import { tap, map } from "rxjs/operators";
import { Observable, of } from 'rxjs';

// Variables globales
import { environment } from './../../environments/environment';

// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  constructor(private http: HttpClient) { }

  /**
 * ShowVisitas
 */
  public showVisitas(id: number) {

    return this.http.get<any>(base_url + `/api/visitas/${id}`);
  }

  /**
 * Store visita
 */
  public storeVisita(persona: any) {
    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/visitas', persona);

  }

  /**
  * UpdateVisitas
  */
  public updateVisita(updateDatos: any, id: number) {

    return this.http.put<any>(base_url + `/api/visitas/${id}`, updateDatos);

  }

  /**
  * Index visitas 
  */
  public indexVisitas(page: number) {

    // Manda parametros por params(URL) -  https://reqres.in/api/user?page=2
    let params = new HttpParams()
    params = params.set('page', page.toString())

    const options = { params: params };

    return this.http.get<any>(base_url + `/api/visitas`, options);
  }

  /**
  * Index visitas 
  */
  public indexVisitaHistorial(id: number) {

    return this.http.get<any>(base_url + `/api/visitas/historial/${id}`);
  }

  /**
   * eliminar Visita
   */
  public destroyVisita(id: number) {

    return this.http.delete<any>(base_url + '/api/visitas/' + id);

  }

  /**
   * Buscar visitas
   */
  public searchVisitas(visita: any) {

    return this.http.post<any>(base_url + '/api/visitas/buscarvisitas', visita);

  }

  /**
  * paginateVisitas
  */
  public paginateVisitas(formData: any) {

    // Manda parametros por params(URL) -  https://reqres.in/api/user?page=2
    let params = new HttpParams()
    params = params.set('page', (formData.page).toString())

    const options = { params: params };

    return this.http.get<any>(base_url + '/api/visitas', options);
  }

  /**
  * UpdateVisitas
  */
  public updateFechaSalida(updateDatos: any, id: number) {

    return this.http.put<any>(base_url + `/api/visitas/fechasalida/${id}`, updateDatos);

  }

  /**
* Index visitas 
*/
  public indexVisitaHistorialReal(carnet: any) {

    return this.http.get<any>(base_url + `/api/visitas/historialreal/${carnet}`);
  }

}
