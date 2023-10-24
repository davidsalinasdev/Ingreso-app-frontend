import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisitasService } from 'src/app/services/visitas.service';

@Component({
  selector: 'app-historial-visitas',
  templateUrl: './historial-visitas.component.html',
  styleUrls: ['./historial-visitas.component.css']
})
export class HistorialVisitasComponent {

  public dataVisitas: any[] = [];

  public id!: any; // Declara una propiedad para almacenar el valor del parámetro "id"

  constructor(
    private route: ActivatedRoute,
    private visitaServices: VisitasService
  ) { }

  ngOnInit() {
    // Suscríbete a los cambios en los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      // Accede al valor del parámetro "id"
      this.id = params.get('id');

      this.indexVistaHistorial();
      // Puedes utilizar this.id en tu componente
    });
  }

  /**
   * indexVistaHistorial
   */
  public indexVistaHistorial() {

    this.visitaServices.indexVisitaHistorial(this.id)
      .subscribe({
        next: ({ historial }) => {
          this.dataVisitas = historial;
        },
        error: (err: any) => {
          console.log(err);

        },
        complete: () => {

        }
      })
  }

}
