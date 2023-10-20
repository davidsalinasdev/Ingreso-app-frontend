import { Component, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, FormGroupDirective, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PruebaService } from '../../services/prueba.service';

// Alertas
import Swal from 'sweetalert2';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Modelos
import { ServidorInterface } from 'src/app/models/servidor.model';
import { PruebaInterface } from 'src/app/models/pruebas.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';


// Utilizando jquery
declare var JQuery: any;
declare var $: any;

// Interface tipo de usuario
interface TipoUsuario {
  value: string;
  viewValue: string;
}

interface EstadoServidor {
  label: string;
  value: string;
}

// Prueba
export interface RolUsuario {
  label: string;
  value: string;
}
// FIN PRUEBA



@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

  // Información de usuario de sistema
  public usuario: any;
  public token: any;
  public rol: any;

  public tipoUsuario: TipoUsuario[] = [
    { value: 'funcionario', viewValue: 'Funcionario publico' },
    { value: 'minero', viewValue: 'Minero' },
    { value: 'agente', viewValue: 'Agente de retención' },
  ];

  // Formularios reactivos
  public formulario!: FormGroup;
  public formularioModificar!: FormGroup;
  public formularioSearch!: FormGroup;

  // Para deshabilitar el boton de guardar
  public btnSave: boolean = true;

  public estados: EstadoServidor[] = [
    { label: 'Habilitado', value: 'Habilitado' },
    { label: 'No habilitado', value: 'No habilitado' }
  ];

  public roles: RolUsuario[] = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Funcionario', value: 'Funcionario' },
    { label: 'Invitado', value: 'Invitado' }
  ]

  public idServidor!: number;

  // loading para atributo [hidden]
  // [hidden]= true  -> oculta el contenido
  public cargando: boolean = true;

  // Mejorar el performance de la busqueda
  private OnDestroy$ = new Subject();
  public searchTerm$ = new Subject<string>();



  public dataServidores!: PruebaInterface[];

  public idServidorModificar!: number;

  // Paginación
  public current_page: any;
  public first_page_url: any;
  public from: any;
  public last_page: any;
  public last_page_url: any;
  public next_page_url: any;
  public path: any
  public per_page: any;
  public prev_page_url: any;
  public to: any
  public total: number = 0;
  public p: number = 1;
  // Fin Paginación


  // Limpiar input buscador
  public searchTerm: string = '';


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private usuarioServices: UsuariosService,
    private pruebaServices: PruebaService
  ) { }

  ngOnInit(): void {

    this.eliminarLocalStorage();

    this.crearFormulario();
    this.crearFormularioModificar();
    this.indexServidores();
    // Buscador de servidores publicos
    this.submitSearch();

    // Borrar texto buscar

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity;
      this.token = token;
      this.rol = identity.rol;
    }

  }

  /**
  * crearFormulario
  */
  public crearFormulario() {
    this.formulario = this.fb.group({
      prueba: ['', Validators.compose([Validators.required, Validators.maxLength(70)])]
    });
  }

  // Función personalizada para validar la contraseña
  public validatePassword(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const isValid = passwordRegex.test(control.value);
    return isValid ? null : { invalidPassword: true };
  }

  get prueba() {
    return this.formulario.get('prueba');
  }


  /**
  * crearFormularioModificar
  */
  public crearFormularioModificar() {
    this.formularioModificar = this.fb.group({
      pruebaM: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      estadoM: ['', Validators.compose([Validators.required])],
    });
  }

  get pruebaM() {
    return this.formularioModificar.get('nombresM');
  }

  get estadoM() {
    return this.formularioModificar.get('estadoM');
  }

  /**
   * Registrar nuevo usuario
   */
  public submit() {

    this.btnSave = false;
    this.cargando = true;

    const formData = {
      prueba: this.formulario.value.prueba,
      users_id: this.usuario.sub
    }

    this.pruebaServices.storePrueba(formData)
      .subscribe({
        next: ({ status, message }) => {
          if (status === 'success') {

            this.eliminarLocalStorage();

            $('#myModal_crear_servidor').modal('hide');
            this.indexServidores(); //aqui esta this.cargando = true;
            // Limpiar el campo de búsqueda
            this.searchTerm = '';
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${message}`,
              text: 'Sistema de test vocacional Jack Bolivia 2000',
              showConfirmButton: false,
              timer: 2000
            })
          } else {
            this.toastr.error(message, 'Sistema de test vocacional Jack Bolivia 2000');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.cargando = false;
          this.btnSave = true;

          if (err.error.errors.prueba) {
            Swal.fire('Error', err.error.errors.prueba[0], 'error')
          } else {
            Swal.fire('Error', err.error.message, 'error')
          }

        },
        complete: () => {
          this.btnSave = true;
          this.cargando = false;
        }
      });

  }

  /**
   * indexServidores
   */
  public indexServidores() {

    this.dataServidores = [];
    this.cargando = true;

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    if (textoBuscar != null) {

      const posicion = localStorage.getItem('position');

      const formData: { prueba: string, page: number } = {
        prueba: textoBuscar,
        page: Number(posicion)
      }

      this.cargando = true;
      this.pruebaServices.searchPruebas(formData)
        .subscribe(({ pruebas }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = pruebas;

          this.dataServidores = data;
          console.log(this.dataServidores);


          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = this.current_page;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })

    } else {
      let pagina = 1;
      const position = localStorage.getItem('position');
      if (position != null) {
        pagina = Number(position);
      }

      this.pruebaServices.indexPruebas(pagina)
        .subscribe(({ pruebas }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = pruebas;

          this.cargando = false;

          this.dataServidores = data;
          console.log(this.dataServidores);
          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = current_page;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);

        })
    }


  }

  /**
  * Cargar datos para modificar servidores
  */
  public modificarServidoresPublicos(id: number) {

    this.idServidor = id;

    this.pruebaServices.showPrueba(id)
      .subscribe(({ pruebas }) => {

        this.idServidorModificar = pruebas.id;

        this.formularioModificar.setValue({
          pruebaM: pruebas.prueba,
          estadoM: pruebas.estado,
        });

      }, (err) => {
        Swal.fire('Error', err.error.message, 'error')
      });

    $('#myModal_editar_usuario').modal('show');
  }

  /**
  * submitModificar
  */
  public submitModificar() {

    const formData = {
      prueba: this.formularioModificar.value.pruebaM,
      estado: this.formularioModificar.value.estadoM,
    }

    this.cargando = true;
    this.btnSave = false;
    this.pruebaServices.updatePruebas(formData, this.idServidor)
      .subscribe(({ message }) => {

        $('#myModal_editar_usuario').modal('hide');
        this.indexServidores();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '¡Modificación Correcta!',
          text: `${message}`,
          showConfirmButton: false,
          timer: 2000
        })

      }, (err) => {
        console.log(err);
        Swal.fire('Error', err.error.message, 'error')
        this.cargando = false;
        this.btnSave = true;
      }, () => {
        this.cargando = false;
        this.btnSave = true;
      });

  }

  /**
* borrarFormulario
*/
  public borrarFormulario(formDirective: FormGroupDirective) {
    this.formulario.reset();
    if (this.formulario.valid || !this.formulario.valid) {
      formDirective.resetForm();
      this.formulario.reset();
    }
  }

  /**
  * destroyPersona
  */
  public destroyServidorPublico(id: number, prueba: string, estado: string) {

    if (estado === 'No habilitado') {
      this.toastr.error('Esta prueba ya ha sido deshabilitado', 'Sistema de test vocacional')
    } else {
      Swal.fire({
        title: 'Se deshabilitara la:',
        text: `${prueba}`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar!',
        confirmButtonText: 'Si, deshabilitar!'
      }).then((result) => {
        if (result.isConfirmed) {

          this.pruebaServices.destroyPrueba(id)
            .subscribe(({ status, message }) => {
              if (status === 'success') {
                this.indexServidores();
                Swal.fire(
                  `${prueba}`,
                  `A sido deshabilitado correctamente`,
                  'success'
                );
              }
            }, (err) => {
              this.cargando = false;
              Swal.fire('Error', err.error.message, 'error')
            });
        }
      })
    }
  }


  /**
  * Formulario buscar servidor publico
  */
  public submitSearch() {

    // this.cargandoBuscar = true;
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.OnDestroy$)
    )
      .subscribe(texto => {

        localStorage.setItem('textoBuscar', texto);

        if (texto.length === 0) {
          this.indexServidores();
          localStorage.removeItem('textoBuscar');
        } else {
          const formData: { prueba: string } = {
            prueba: texto
          }
          this.cargando = true;
          this.pruebaServices.searchPruebas(formData)
            .subscribe(({ pruebas }) => {

              const {
                data,
                current_page,
                first_page_url,
                from,
                last_page,
                last_page_url,
                next_page_url,
                path,
                per_page,
                prev_page_url,
                to,
                total
              } = pruebas;

              this.dataServidores = data;

              this.current_page = current_page;
              this.first_page_url = first_page_url;
              this.from = from;
              this.last_page = last_page;
              this.last_page_url = last_page_url;
              this.next_page_url = next_page_url;
              this.path = path;
              this.per_page = per_page;
              this.prev_page_url = prev_page_url;
              this.to = to;
              this.total = total;

              this.p = this.current_page;

              this.cargando = false;

              // Para paginación
              localStorage.setItem('position', `${this.p}`);
              localStorage.setItem('items', `${this.total}`);
            })
        }
      });
  }

  /**
   * pageChange(event)  
   */
  public pageChange(event: any) {

    this.dataServidores = [];
    this.cargando = true;
    this.p = event;

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    // 
    if (textoBuscar != null) {

      const formData: { servidor: string, page: number } = {
        servidor: textoBuscar,
        page: this.p
      }

      this.cargando = true;
      this.usuarioServices.searchServidoresPublicos(formData)
        .subscribe(({ servidores }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = servidores;

          this.dataServidores = data;
          console.log(this.dataServidores);


          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = this.current_page;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })

    } else {
      const formData: { page: number } = {
        page: this.p
      }
      this.usuarioServices.paginateServidores(formData)
        .subscribe(({ users }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = users;

          this.dataServidores = data;

          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })
    }
  }


  /**
   * generarenlace
id:number   */
  public generarEnlace(id: number, estado: string, prueba: string) {

    if (estado === 'Habilitado') {
      const mensaje = '*Test Vocacional - JacBolivia2000*';
      const tema = `*Nombre prueba:* ${prueba}`;
      const espacio = ` `;
      const enlaceTitulo = `*Enlace Test* `;
      const enlacePrueba = `https://test.jacbolivia2000.com/#/vocacional/${id}`;

      const mensajeCompleto = mensaje + '\n' + tema + '\n' + espacio + '\n' + enlaceTitulo + '\n' + enlacePrueba + '\n';
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensajeCompleto)}`;
      window.open(url);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La prueba debe estar Habilitada para generar enlace!',
        footer: '<p>Test Vocacional JacBolivia2000</p>'
      })
    }

  }

  /**
    * eliminarLocalStorage
    */
  public eliminarLocalStorage() {
    localStorage.removeItem('textoBuscar');
    localStorage.removeItem('items');
    localStorage.removeItem('position');
  }


}
