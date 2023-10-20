import { Component, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, FormGroupDirective, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios
import { UsuariosService } from 'src/app/services/usuarios.service';

// Alertas
import Swal from 'sweetalert2';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Modelos
import { ServidorInterface } from 'src/app/models/servidor.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { VisitasService } from '../../services/visitas.service';
import { VisitasInterface } from 'src/app/models/visitas.model';


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
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

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
    { label: 'Usuario', value: 'Usuario' }
  ]

  public idServidor!: number;
  public idVisita!: number;

  // loading para atributo [hidden]
  // [hidden]= true  -> oculta el contenido
  public cargando: boolean = true;

  // Mejorar el performance de la busqueda
  private OnDestroy$ = new Subject();
  private OnDestroyNormal$ = new Subject();
  public searchTerm$ = new Subject<string>();
  public searchTermCarnet$ = new Subject<string>();



  public dataServidores!: ServidorInterface[];

  public dataVisitas!: VisitasInterface[];
  public dataHistorialReal!: VisitasInterface[];

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
  public searchTermCarnet: string = '';

  public visitasRegistradas: string = '';
  public color!: boolean;

  public cantVisitas!: number;
  public cantCurso!: number;

  public nowDate = new Date();
  public anio!: number;

  public contadorIngreso: number = 1;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private usuarioServices: UsuariosService,
    private visitasServices: VisitasService
  ) { }

  ngOnInit(): void {

    this.anio = this.nowDate.getFullYear();

    this.eliminarLocalStorage();

    this.crearFormulario();
    this.crearFormularioModificar();
    this.indexVisitas();
    // Buscador de servidores publicos
    this.submitSearch();
    this.submitSearchCarnet();



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
      carnet: ['', Validators.compose([Validators.required, Validators.maxLength(12)])],
      nombres: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      lugar: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    });
  }

  // Función personalizada para validar la contraseña
  public validatePassword(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const isValid = passwordRegex.test(control.value);
    return isValid ? null : { invalidPassword: true };
  }

  get carnet() {
    return this.formulario.get('carnet');
  }


  get nombres() {
    return this.formulario.get('nombres');
  }

  get lugar() {
    return this.formulario.get('lugar');
  }



  /**
  * crearFormularioModificar
  */
  public crearFormularioModificar() {
    this.formularioModificar = this.fb.group({
      carnetM: ['', Validators.compose([Validators.required, Validators.maxLength(12)])],
      nombresM: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      lugarM: ['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    });
  }

  get carnetM() {
    return this.formularioModificar.get('paternoM');
  }

  get nombresM() {
    return this.formularioModificar.get('nombresM');
  }

  get lugarM() {
    return this.formularioModificar.get('paternoM');
  }

  /**
   * Registrar nuevo usuario
   */
  public submit() {

    this.btnSave = false;
    this.cargando = true;

    const formData = {
      carnet: this.formulario.value.carnet,
      nombres: this.formulario.value.nombres,
      lugar: this.formulario.value.lugar,
      users_id: this.usuario.sub
    }

    this.visitasServices.storeVisita(formData)
      .subscribe({
        next: ({ status, message }) => {
          if (status === 'success') {

            this.eliminarLocalStorage();
            this.indexVisitas(); //aqui esta this.cargando = true;
            // Limpiar el campo de búsqueda
            this.dataHistorialReal = [];
            this.color = false;
            this.visitasRegistradas = '';
            this.formulario.reset();
            this.searchTerm = '';
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${message}`,
              text: 'Sistema de control visitas al GADC',
              showConfirmButton: false,
              timer: 2000
            })

          } else {
            this.toastr.error(message, 'Sistema de control de visitas al GADC');
          }
        },
        error: (err: any) => {
          console.log(err);
          this.cargando = false;
          this.btnSave = true;

          // if (err.error.errors.carnet) {
          //   Swal.fire('Error', err.error.errors.carnet[0], 'error')
          // } else {
          //   Swal.fire('Error', err.error.message, 'error')
          // }

        },
        complete: () => {
          this.btnSave = true;
          this.cargando = false;
        }
      });

  }

  /**
   * IndexServidores
   */
  public indexVisitas() {

    this.dataVisitas = [];
    this.cargando = true;

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    if (textoBuscar != null) {

      const posicion = localStorage.getItem('position');

      const formData: { visitante: string, page: number } = {
        visitante: textoBuscar,
        page: Number(posicion)
      }

      this.cargando = true;
      this.visitasServices.searchVisitas(formData)
        .subscribe(({ visitas }) => {

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
          } = visitas;

          this.dataVisitas = data;

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

      this.visitasServices.indexVisitas(pagina)
        .subscribe(({ visitas, cantidad, cantCurso }) => {

          this.cantVisitas = cantidad;
          this.cantCurso = cantCurso;

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
          } = visitas;

          this.cargando = false;

          this.dataVisitas = data;

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
  public modificarVisita(id: number) {

    this.idVisita = id;

    this.visitasServices.showVisitas(id)
      .subscribe(({ visitas }) => {

        this.idServidorModificar = visitas.id;

        this.formularioModificar.setValue({
          carnetM: visitas.carnet,
          nombresM: visitas.nombres,
          lugarM: visitas.lugar,
        });

      }, (err) => {
        Swal.fire('Error', err.error.message, 'error')
      });

    $('#myModal_editar_visita').modal('show');
  }

  /**
  * submitModificar
  */
  public submitModificar() {

    const formData = {
      carnet: this.formularioModificar.value.carnetM,
      nombres: this.formularioModificar.value.nombresM,
      lugar: this.formularioModificar.value.lugarM,
      users_id: this.usuario.sub
    }
    this.cargando = true;
    this.btnSave = false;
    this.visitasServices.updateVisita(formData, this.idVisita)
      .subscribe(({ message }) => {

        $('#myModal_editar_visita').modal('hide');
        this.indexVisitas();
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
  public destroyVisita(id: number, nombres: string) {
    Swal.fire({
      title: 'Se eliminara a:',
      text: `${nombres}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.visitasServices.destroyVisita(id)
          .subscribe(({ status, message }) => {
            if (status === 'success') {
              this.indexVisitas();
              Swal.fire(
                `${nombres}`,
                `A sido eliminado correctamente`,
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


  /**
  * Formulario buscar servidor publico
  */
  public submitSearch() {

    // this.cargandoBuscar = true;
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.OnDestroyNormal$)
    )
      .subscribe(textonormal => {

        console.log('textonormal');
        console.log(textonormal);


        localStorage.setItem('textoBuscar', textonormal);

        if (textonormal.length === 0) {
          this.indexVisitas();
          localStorage.removeItem('textoBuscar');
        } else {
          const formData: { visitante: string } = {
            visitante: textonormal
          }
          this.cargando = true;
          this.visitasServices.searchVisitas(formData)
            .subscribe(({ visitas }) => {

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
              } = visitas;

              this.dataVisitas = data;

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
 * Formulario buscar servidor publico
 */
  public submitSearchCarnet() {

    // this.cargandoBuscar = true;
    this.searchTermCarnet$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.OnDestroy$)
    )
      .subscribe(texto => {

        console.log('SubmitSearchCarnet');


        if (texto.length === 0) {
          this.dataHistorialReal = [];
          this.visitasRegistradas = "";
          this.color = false;
          this.formulario.reset();
        } else {

          this.visitasServices.indexVisitaHistorialReal(texto)
            .subscribe({
              next: (({ historialreal }) => {
                this.dataHistorialReal = historialreal;

                if (this.dataHistorialReal.length === 0) {
                  this.visitasRegistradas = 'No tiene visitas registradas'
                  this.color = false;
                } else {
                  this.visitasRegistradas = 'Tiene visitas registradas'
                  this.color = true;
                  this.formulario.patchValue({
                    nombres: this.dataHistorialReal[0].nombres
                  });

                  // const lugarFieldElement = document.getElementById('lugar');

                  // if (lugarFieldElement) {
                  //   lugarFieldElement.focus();
                  // }
                }


              })
            })

        }
      });
  }


  /**
 * submitModificar
 */
  public salidaVisita(id: number, carnet: any, nombres: any) {

    const formData = {};

    this.cargando = true;
    this.btnSave = false;

    // Swal.fire({
    //   title: 'Finalizar Visita',
    //   text: `Se registrara la salida de: CI: ${carnet}, Nombres: ${nombres}`,
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Si, Registrar Salida',
    //   cancelButtonText: 'Cancelar'

    // }).then((result) => {
    //   if (result.isConfirmed) {

    this.visitasServices.updateFechaSalida(formData, id)
      .subscribe(({ message }) => {

        this.indexVisitas();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${message}`,
          showConfirmButton: false,
          timer: 1500
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


    //   }
    // })



  }

  /**
    * eliminarLocalStorage
    */
  public eliminarLocalStorage() {
    localStorage.removeItem('textoBuscar');
    localStorage.removeItem('items');
    localStorage.removeItem('position');
  }


  /**
 * pageChange(event)  
 */
  public pageChange(event: any) {

    const pagina: number = 10;

    this.dataVisitas = [];
    this.cargando = true;
    this.p = event;


    if (this.p === 1) {
      this.contadorIngreso = 1;
    } else {
      this.contadorIngreso = this.p * pagina;
    }

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    // 
    if (textoBuscar != null) {

      const formData: { visitante: string, page: number } = {
        visitante: textoBuscar,
        page: this.p
      }

      this.cargando = true;
      this.visitasServices.searchVisitas(formData)
        .subscribe(({ visitas }) => {

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
          } = visitas;

          this.dataVisitas = data;

          console.log(this.dataVisitas);

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
      this.visitasServices.paginateVisitas(formData)
        .subscribe(({ visitas }) => {

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
          } = visitas;

          this.dataVisitas = data;

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

}

