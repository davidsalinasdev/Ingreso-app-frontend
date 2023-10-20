
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
export class PruebaService {

  constructor(private http: HttpClient) { }

  // Por David Salinas Poma
  /**
  * Store servidores publicos 
  */
  public storePrueba(reuniones: any) {

    /*
       Antes sin interceptores
        let headers = new HttpHeaders();
        headers = headers.set('token-usuario', this.token);
        const options = { headers: headers };
        return this.http.post<any>(base_url + '/api/servidores', reuniones, options);
    */

    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/prueba', reuniones);

  }

  /**
* Store servidores publicos 
*/
  public indexPruebas(page: number) {

    // Manda parametros por params(URL) -  https://reqres.in/api/user?page=2
    let params = new HttpParams()
    params = params.set('page', page.toString())

    const options = { params: params };

    return this.http.get<any>(base_url + `/api/prueba`, options);
  }

  /**
* ShowReuniones
*/
  public showPrueba(id: number) {

    return this.http.get<any>(base_url + `/api/prueba/${id}`);
  }


  /**
   * updateServidores
   */
  public updatePruebas(updateDatos: any, id: number) {

    return this.http.put<any>(base_url + `/api/prueba/${id}`, updateDatos);

  }

  /**
 * Buscar servidores publicos
 */
  public searchPruebas(prueba: any) {

    return this.http.post<any>(base_url + '/api/prueba/buscarpruebas', prueba);

  }

  /**
   * eliminar Servidor
  */
  public destroyPrueba(id: number) {
    return this.http.delete<any>(base_url + '/api/prueba/' + id);
  }


}
