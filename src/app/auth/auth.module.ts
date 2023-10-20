// Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

// Componentes angular material
import { MaterialModule } from '../material/material.module';

// Componentes primeNG
import { PrimengModule } from '../primeng/primeng.module';

// Componentes de este Modulo
import { LoginComponent } from './login/login.component';
import { VocacionalComponent } from './vocacional/vocacional.component';
import { EjemplosComponent } from './ejemplos/ejemplos.component';

@NgModule({
  declarations: [
    LoginComponent,
    VocacionalComponent,
    EjemplosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimengModule,
    MaterialModule
  ],
  exports: [
    LoginComponent,
    VocacionalComponent,
    EjemplosComponent
  ]
})
export class AuthModule { }
