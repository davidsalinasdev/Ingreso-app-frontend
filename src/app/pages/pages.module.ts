import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing central de PAGES
import { PagesRoutingModule } from './pages-routing.module';

// Componentes de PAGES
import { PagesComponent } from './pages.component';
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';


// Modulo shared
import { SharedModule } from '../shared/shared.module';

// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Paginación
import { NgxPaginationModule } from 'ngx-pagination';

// Full calendar
import { FullCalendarModule } from '@fullcalendar/angular';

// Componentes primeNG
import { PrimengModule } from '../primeng/primeng.module';

// Componentes reutilizables
import { ComponentsModule } from '../components/components.module';

// Angular Material
import { MaterialModule } from '../material/material.module';
import { PruebaComponent } from './prueba/prueba.component';
import { ListaPruebaComponent } from './lista-prueba/lista-prueba.component';
import { MostrarPruebaComponent } from './mostrar-prueba/mostrar-prueba.component';

// Graficas
import { NgChartsModule } from 'ng2-charts';
import { IngresoComponent } from './ingreso/ingreso.component';
import { HistorialVisitasComponent } from './historial-visitas/historial-visitas.component';

import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent,
    PerfilComponent,
    PruebaComponent,
    ListaPruebaComponent,
    MostrarPruebaComponent,
    IngresoComponent,
    HistorialVisitasComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FullCalendarModule,
    PrimengModule,
    ComponentsModule,
    MaterialModule,
    NgChartsModule,
    NgxPrintModule
  ],
  exports: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent,
    PerfilComponent,
    IngresoComponent,
    HistorialVisitasComponent
  ]
})
export class PagesModule { }
