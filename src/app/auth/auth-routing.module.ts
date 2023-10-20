import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componente de AUTH
import { LoginComponent } from './login/login.component';

// Guardian
import { HasPermanecerGuard } from '../guards/has-permanecer.guard';
import { VocacionalComponent } from './vocacional/vocacional.component';
import { EjemplosComponent } from './ejemplos/ejemplos.component';



const routes: Routes = [
  /****  Rutas PUBLICAS Principales como hijas de app-routing.module.ts****/
  {
    path: 'login',
    component: LoginComponent,
    data: { titulo: 'Login' },
    // canActivate: [HasPermanecerGuard]
  },
  {
    path: 'vocacional/:id',
    component: VocacionalComponent,
    data: { titulo: 'Gestión vocacional' },
    // canActivate: [HasPermanecerGuard]
  },
  {
    path: 'ejemplos',
    component: EjemplosComponent,
    data: { titulo: 'Gestión de ejemplos' },
    // canActivate: [HasPermanecerGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
