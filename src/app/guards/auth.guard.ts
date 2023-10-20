import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Servicios
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private usuarioServices: UsuariosService,
        private router: Router
    ) { }



    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        return this.usuarioServices.validarToken()
            .pipe(
                tap(estaAutenticado => {
                    if (!estaAutenticado) {
                        // console.log('Hola2');

                        this.router.navigateByUrl('/login');
                    }
                })
            );
    }

}
