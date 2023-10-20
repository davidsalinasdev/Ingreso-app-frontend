import { autoTable } from './../../../../node_modules/jspdf-autotable/dist/index.d';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Servicios
import { TestService } from 'src/app/services/test.service';

// Graficas
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, ThemeService } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

import html2pdf from 'html2pdf.js';

import html2canvas from 'html2canvas';

import jsPDF from "jspdf";
import domtoimage from 'dom-to-image';


import "jspdf-autotable";
const doc = new jsPDF();

@Component({
  selector: 'app-mostrar-prueba',
  templateUrl: './mostrar-prueba.component.html',
  styleUrls: ['./mostrar-prueba.component.css']
})
export class MostrarPruebaComponent {

  public idTest!: any;
  public idBack!: any;
  public datosEstudiante!: any;
  public datosTests!: any;

  // Graficas
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        max: 10,
      },
      y: {
        min: 1,
      },
    },

    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };


  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];


  public barChartData!: ChartData<'bar'>;

  @ViewChild('pdfContent', { static: true }) pdfContent!: ElementRef;

  public pdfShow: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private testServices: TestService
  ) {

    this.idTest = this.route.snapshot.paramMap.get('id');
    console.log('ID del parámetro:', this.idTest);

    this.showTest();

  }

  downloadPdf() {



    const content = this.pdfContent.nativeElement;

    const options = {
      margin: 10,
      filename: 'design.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(content)
      .set(options)
      .outputPdf((pdf: any) => {
        console.log('Hola Mundo');
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'design.pdf';
        a.click();
        URL.revokeObjectURL(url);
      });
  }

  /**
   * showTest
   */
  public showTest() {
    this.testServices.showTest(this.idTest)
      .subscribe({
        next: (resp => {
          const { tests } = resp;
          this.datosTests = JSON.parse(tests.datos_tests);
          // console.log(this.datosTests);

          this.barChartData = {
            labels: ['C', 'H', 'A', 'S', 'I', 'D', 'E'],
            datasets: [
              {
                data: this.datosTests,
                label: 'Test',
                backgroundColor: [
                  'rgba(10, 51, 92, .64)',
                  'rgba(235, 24, 59, 0.64)',
                  'rgba(248, 244, 3, 0.64)'
                ]

              },
              // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
            ]
          }
          this.datosEstudiante = tests;
          // console.log(this.datosEstudiante);
          this.idBack = this.datosEstudiante.pruebas_id;
        })
      });
  }

  // Graficas
  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: object[];
  // }): void {
  //   console.log(event, active);
  // }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }

  captureDiv() {
    const divToCapture = document.getElementById('miID'); // Reemplaza 'tuDivID' con el ID de tu div
    html2canvas(divToCapture!).then((canvas: any) => {
      // Ahora tienes el contenido del div capturado en un objeto canvas
      const imgData = canvas.toDataURL('image/jpeg'); // Convierte el canvas en una imagen JPEG
      this.downloadImage(imgData);
    });
  }
  downloadImage(dataUrl: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'captura.jpg'; // Nombre del archivo
    a.click();
  }

  pdf() {
    // Mostrar la tabla antes de tomar la captura de pantalla
    this.pdfShow = false;

    // Espera un breve momento para que la tabla se vuelva visible antes de tomar la captura de pantalla
    setTimeout(() => {
      var canvas = document.getElementById('canvas');
      console.log(canvas);

      // Desactiva las sombras en los elementos de la página antes de la captura de pantalla
      html2canvas(canvas as any).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'cm', 'A4');
        pdf.addImage(contentDataURL, 'PNG', 1.8, 0, 17.0, 29.7);

        // Guardar el PDF
        pdf.save(`${this.datosEstudiante?.nombres}.pdf`);

        // Ocultar la tabla después de generar el PDF
        this.pdfShow = true;
      });
    }, 1000); // Espera 100 milisegundos (ajusta el valor según sea necesario)
  }

}
