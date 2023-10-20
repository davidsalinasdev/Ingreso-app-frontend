import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Variables globales
import { environment } from './../../environments/environment';

import { Punto } from 'src/app/models/puntos.model';

// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  /**
    * Index Test por prueba
    */
  public indexTest(id: number) { // Enviando el id Evento
    // Ahora con interceptores
    return this.http.post<any>(base_url + `/api/test/indextestprueba`, { idPrueba: id });

  }

  /**
  * Store nuevos Puntos
  */
  public storeTest(test: any) {

    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/test', test);

  }

  /**
  * ShowPunto
  */
  public showTest(id: number) {

    // Ahora con interceptores
    return this.http.get<any>(base_url + `/api/test/${id}`);

  }


  /**
  * updatePunto
  */
  public updatePunto(puntoData: Punto, id: number) {
    return this.http.put<any>(base_url + `/api/puntos/${id}`, puntoData);
  }


  /**
 * eliminar Punto
 */
  public destroyPunto(id: number) {

    return this.http.delete<any>(base_url + `/api/puntos/${id}`);

  }

  /**
* Buscar servidores publicos
*/
  public searchTest(prueba: any) {

    return this.http.post<any>(base_url + '/api/test/buscartest', prueba);

  }
}

