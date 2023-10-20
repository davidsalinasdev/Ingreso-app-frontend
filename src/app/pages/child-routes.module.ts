
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes de PAGES
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { PruebaComponent } from './prueba/prueba.component';

// Guardianes
import { HasRoleService } from '../guards/has-role.guard';
import { HasInicioService } from '../guards/has-inicio.guard';
import { ListaPruebaComponent } from './lista-prueba/lista-prueba.component';
import { MostrarPruebaComponent } from './mostrar-prueba/mostrar-prueba.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { HistorialVisitasComponent } from './historial-visitas/historial-visitas.component';

const childRoute: Routes = [

    // RUTAS HIJAS DE
    // {
    //     path: '', component: InicioComponent,
    //     data: { titulo: 'Agenda institucional GADC' },
    //     canActivate: [HasInicioService]
    // }, 

    {
        path: '',
        component: IngresoComponent,
        data: { titulo: 'Gestión de ingreso de personas a los ambientes del gadc', titulo_dos: 'Ingreso GADC' },
        // canActivate: [HasInicioService]
    },

    {
        path: 'pruebas',
        component: PruebaComponent,
        data: { titulo: 'Gestión de pruebas' },
        // canActivate: [HasInicioService]
    },

    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Gestión de usuarios' },
        canActivate: [HasRoleService]
    },

    {
        path: 'listaprueba/:id',
        component: ListaPruebaComponent,
        data: { titulo: 'Lista de pruebas de estudiantes' },
        // canActivate: [HasInicioService]
    },

    {
        path: 'listahistorial/:id',
        component: HistorialVisitasComponent,
        data: { titulo: 'Historial de visitas', titulo_dos: 'Historial' },
        // canActivate: [HasInicioService]
    },

    {
        path: 'mostrarprueba/:id',
        component: MostrarPruebaComponent,
        data: { titulo: 'Datos del test del estudiante' },
        // canActivate: [HasInicioService]
    },


    // Path inicial
    { path: 'perfil', component: PerfilComponent, data: { titulo: 'Datos de usuario' } }, // Path inicial
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

]

@NgModule({
    imports: [RouterModule.forChild(childRoute)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }