import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Componentes PrimeNG
import { SelectItem } from 'primeng/api';

// Modelos
import { datosTestInterface } from 'src/app/models/datosTest.model';
import { EstudianteInterface } from 'src/app/models/estudiante.model';
import { PruebaService } from 'src/app/services/prueba.service';

// Servicios
import { TestService } from 'src/app/services/test.service';

// Alertas
import Swal from 'sweetalert2';


// Definir la interfaz para el objeto
interface ObjetoRespuesta {
  respuesta: string;
  dato_extra: any; // Puedes cambiar el tipo según tus necesidades
}

@Component({
  selector: 'app-vocacional',
  templateUrl: './vocacional.component.html',
  styleUrls: ['./vocacional.component.css']
})
export class VocacionalComponent {


  // Formulario de inscripcion
  public formulario!: FormGroup;
  public formularioTest!: FormGroup;
  public options: SelectItem[]; // Las opciones para el input de selección

  public estudiante!: EstudianteInterface;


  public btnGuardar: boolean = true;
  public btnDatos: boolean = true;

  public showTest: boolean = true;

  // Propiedad para las preguntas
  public preguntas: string[] = [
    "1 ¿Aceptarías trabajar escribiendo artículos en la sección del periódico 'Los Tiempos'?",
    "2 ¿Organizarías la despedida de soltero de un amigo?",
    "3 ¿Te gustaría ser ingeniero para dirigir un proyecto de urbanización en una provincia?",
    "4 ¿Ante un fracaso mantienes un pensamiento positivo?",
    "5 ¿Ayudarías voluntariamente a personas accidentadas o atacadas por asaltantes?",
    "6 ¿Cuándo eras niño (a), te interesaba saber cómo estaban construidos tus juguetes?",
    "7 ¿Tienes mayor curiosidad por los misterios de la naturaleza que por los avances de la tecnología?",
    "8 ¿Escuchas atentamente las complicaciones que te plantean tus amigos?",
    "9 ¿Te brindarías para explicar a tus compañeros un tema que ellos no entendieron?",
    "10 ¿Cuando trabajas en equipo te consideras estricto y crítico?",
    "11 ¿Te atrae armar rompecabezas?",
    "12 ¿Sabes que significa macroeconomía y microeconomía?",
    "13 ¿Usar traje formal como profesional te hace sentir diferente e importante?",
    "14 ¿Participarías de una investigación sobre la Violencia Contra la Mujer?",
    "15 ¿Administras tu dinero de manera que te alcance para todos tus gastos mensuales?",
    "16 ¿Tienes la facilidad de convencer sobre la validez de tus argumentos a otras personas?",
    "17 ¿Sabes sobre los descubrimientos que se están realizando sobre la Teoría del Big Bang?",
    "18 ¿Actuarías con rapidez ante una probable situación de emergencia?",
    "19 ¿Al resolver un problema matemático, insistes hasta hallar la respuesta?",
    "20 ¿Si tu equipo favorito te convocara para dirigir un campo deportivo, aceptarías?",
    "21 ¿Eres el que pone un toque de alegría en las fiestas de cumpleaños?",
    "22 ¿Crees que los detalles son muy importantes en tu vida?",
    "23 ¿Te sentirías a gusto trabajando en el hospital 'Viedma'?",
    "24 ¿Te gustaría mantener la calma en situaciones de emergencia o sismos?",
    "25 ¿Dedicarías varias horas para leer un libro de tu preferencia?",
    "26 ¿Te organizas detalladamente antes de empezar tus trabajos de investigación?",
    "27 ¿Controla tu vida personal tu celular?",
    "28 ¿Disfrutas trabajando con arcilla o plastilina?",
    "29 ¿Ayudas frecuentemente a los no videntes, ancianos (as) a cruzar la calle?",
    "30 ¿Crees que los estudiantes de primaria deberían ser críticos y reflexivos?",
    "31 ¿Considerando la igualdad de géneros, aceptarías que las mujeres formen parte de las fuerzas armadas con los mismas reglas que los hombres?",
    "32 ¿Te gustaría innovar nuevas técnicas a través del microscopio para descubrir nuevas enfermedades?",
    "33 ¿Participarías en una campaña sobre la prevención del VIH?",
    "34 ¿Te importa conocer temas del pasado y la evolución del ser humano?",
    "35 ¿Te gustaría participar en un proyecto de investigación de los movimientos sísmicos y sus consecuencias?",
    "36 ¿Fuera de los horarios escolares realizas algún deporte?",
    "37 ¿Te interesan las actividades de mucha acción como las carreras de autos y de reacción rápida en situaciones imprevistas como un accidente?",
    "38 ¿Te ofrecerías como ayudante para colaborar en los gabinetes espaciales de la NASA?",
    "39 ¿Te interesa más el trabajo manual que el trabajo intelectual?",
    "40 ¿Estarías dispuesto a renunciar un momento familiar de diversión para ofrecer tus servicios profesionales?",
    "41 ¿Participarías en una investigación sobre violencia de género?",
    "42 ¿Te gustaría trabajar en un laboratorio bioquímico mientras estudias?",
    "43 ¿Expondrías tu vida para salvar otra vida? ¿Aunque no lo conozcas?",
    "44 ¿Te gustaría conocer sobre los cursos de primeros auxilios para salvar vidas?",
    "45 ¿Intentarías trabajar en un proyecto todas las veces necesarias hasta cumplir tu objetivo?",
    "46 ¿Organizas correctamente tu tiempo y así alcanzar lo planificado?",
    "47 ¿Te gustaría aprender a fabricar y reparar máquinas?",
    "48 ¿Elegirías una profesión de tu agrado en la que estuvieras alejado de tu familia?",
    "49 ¿Te gustaría vivir en una zona agrícola-ganadera para desarrollarte como profesional?",
    "50 ¿Cuando trabajas en equipo te gusta producir ideas originales para que te tomen en cuenta?",
    "51 ¿Te sientes a gusto coordinando en grupo de trabajo?",
    "52 ¿Crees que es interesante el estudio de las ciencias biológicas?",
    "53 ¿Te sentirías a gusto trabajando en 'YPFB' como director comercial?",
    "54 ¿Te gustaría participar en un proyecto de extracción de Litio en el Salar de Uyuni?",
    "55 ¿Tienes interés por saber cuáles son las causas que determinan los fenómenos naturales, aunque este no altere tu vida?",
    "56 ¿Descubriste un escritor o filósofo que tenga tus mismas ideas con anticipación?",
    "57 ¿Te gustaría algún instrumento musical para tu cumpleaños?",
    "58 ¿Aceptarías colaborar con el cumplimiento de las normas de higiene en lugares públicos?",
    "59 ¿Cuando tus ideas son importantes, las pones en práctica?",
    "60 ¿Cuando se rompe un electrodoméstico en tu casa, intentas repararlo?",
    "61 ¿Formarías parte de un equipo de preservación de la flora y la fauna en extinción?",
    "62 ¿Te gusta investigar en el celular artículos científicos relacionados con la salud?",
    "63 ¿Te parece importante preservar las raíces culturales en Bolivia?",
    "64 ¿Te gustaría trabajar por una distribución más justa de nuestra riqueza aurífera de los ríos del departamento de Beni?",
    "65 ¿Te gustaría realizar tareas de mantenimiento mecánico en un automóvil?",
    "66 ¿Estás a favor de la compra de armamento en tu país?",
    "67 ¿Para ti es fundamental la libertad y la justicia como valor principal?",
    "68 ¿Aceptarías hacer una práctica en la empresa 'PIL', en el sector de control de calidad?",
    "69 ¿Crees que la salud pública debe ser gratuita, prioritaria y eficiente para todos?",
    "70 ¿Te interesaría investigar profundamente sobre la vacuna del COVID-19?",
    "71 ¿En un equipo de trabajo de la empresa 'COMTECO', prefieres el rol de coordinador?",
    "72 ¿Cuando discuten entre dos amigos, te ofreces como intermediario?",
    "73 ¿Estás de acuerdo con la formación de soldados con distintas carreras profesionales?",
    "74 ¿Combatirías por una idea correcta hasta las últimas consecuencias?",
    "75 ¿Te gustaría investigar científicamente sobre los cultivos de variedades de papas?",
    "76 ¿Harías un nuevo diseño de una prenda pasada de moda usando tu creatividad, ante una reunión imprevista?",
    "77 ¿Visitarías un observatorio astronómico para saber cómo funcionan los telescopios?",
    "78 ¿Dirigirías el área de importación y exportación de Industrias 'VENADO'?",
    "79 ¿Te da miedo entrar a un lugar nuevo con personas que no conoces?",
    "80 ¿Te complacería trabajar con niños?",
    "81 ¿Harías el diseño de un afiche para una campaña contra el mal de Chagas?",
    "82 ¿Administrarías un grupo de teatro propio?",
    "83 ¿Enviarías tu hoja de vida a una empresa automotriz que solicita gerente para su área de producción?",
    "84 ¿Te alistarías en un grupo de defensa internacional dentro de la policía boliviana?",
    "85 ¿Costearías tus estudios trabajando en una empresa auditora?",
    "86 ¿Eres de los que defiende problemas ajenos perdidos?",
    "87 ¿Ante una emergencia epidémica como el COVID-19, participarías en una campaña brindando tu ayuda?",
    "88 ¿Sabes qué significa ADN y ARN?",
    "89 ¿Elegirías un trabajo cuya principal herramienta fuera hablar un idioma extranjero?",
    "90 ¿Prefieres trabajar con objetos que trabajar con personas?",
    "91 ¿Te resultaría gratificante ser asesor contable en la empresa 'COBOCE'?",
    "92 ¿Te ofrecerías para cuidar a un enfermo?",
    "93 ¿Te atrae investigar sobre los misterios del universo?",
    "94 ¿Crees que es mejor trabajar individualmente que en equipo?",
    "95 ¿Dedicarías parte de tu tiempo ayudando a personas de zonas alejadas de pobreza extrema con carencias económicas?",
    "96 ¿Cuando eliges tu ropa o decoras tu casa, tienes en cuenta la combinación de colores y la calidad de los muebles?",
    "97 ¿Te gustaría dirigir como ingeniero la empresa hidroeléctrica 'ENDE'?",
    "98 ¿Sabes qué es el PIB?"
  ];


  public alMenosUnSeleccionado: boolean = false;

  // Arreglos del algoritmo Intereses
  public c_i: number[] = [98, 12, 64, 53, 85, 1, 78, 20, 71, 91];
  public h_i: number[] = [9, 34, 80, 25, 95, 67, 41, 74, 56, 89];
  public a_i: number[] = [21, 45, 96, 57, 28, 11, 50, 3, 81, 36];
  public s_i: number[] = [33, 92, 70, 8, 87, 62, 23, 44, 16, 52];
  public i_i: number[] = [75, 6, 19, 38, 60, 27, 83, 54, 47, 97];
  public d_i: number[] = [84, 31, 48, 73, 5, 65, 14, 37, 58, 24];
  public e_i: number[] = [77, 42, 88, 17, 93, 32, 68, 49, 35, 61];

  // Arreglos del algoritmo Aptitudes
  public c_a: number[] = [15, 51, 2, 46];
  public h_a: number[] = [63, 30, 72, 86];
  public a_a: number[] = [22, 39, 76, 82];
  public s_a: number[] = [69, 40, 29, 4];
  public i_a: number[] = [26, 59, 90, 10];
  public d_a: number[] = [13, 66, 18, 43];
  public e_a: number[] = [94, 7, 79, 55];

  public idTest!: any;

  constructor(
    private fb: FormBuilder,
    private testServices: TestService,
    private route: ActivatedRoute,
    private pruebaServices: PruebaService,
    private router: Router
  ) {

    this.idTest = this.route.snapshot.paramMap.get('id');
    console.log('ID del parámetro:', this.idTest);
    this.validarHabilitado();
    this.crearFormulario();
    this.options = [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Femenino', value: 'Femenino' },
    ];
  }


  /**
  * crearFormulario
  */
  public crearFormulario() {
    this.formulario = this.fb.group({
      // Informacion Principal
      nombres: ['', [Validators.required, Validators.maxLength(70)]],
      sexo: ['', [Validators.required]],
      edad: ['', [Validators.required]],

      celular: ['', [Validators.required, Validators.pattern(/^[1-9]\d{6,9}$/)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)])],
      nombre_madre: ['', [Validators.required, Validators.maxLength(70)]],
      celular_madre: ['', [Validators.required, Validators.pattern(/^[1-9]\d{6,9}$/)]],
      nombre_padre: ['', [Validators.maxLength(70)]],
      celular_padre: ['', [Validators.pattern(/^[1-9]\d{6,9}$/)]],

    });


    // Para las preguntas
    const preguntaControls = this.preguntas.map(pregunta => this.fb.control('', Validators.required));


    this.formularioTest = this.fb.group({
      respuestas: this.fb.array(preguntaControls)
    });

  }
  // Validaciones para formulario ESTUDIANTE
  get nombres() {
    return this.formulario.get('nombres');
  }
  get sexo() {
    return this.formulario.get('sexo');
  }
  get edad() {
    return this.formulario.get('edad');
  }

  get celular() {
    return this.formulario.get('celular');
  }
  get email() {
    return this.formulario.get('email');
  }

  get nombre_madre() {
    return this.formulario.get('nombre_madre');
  }
  get celular_madre() {
    return this.formulario.get('celular_madre');
  }
  get nombre_padre() {
    return this.formulario.get('nombre_padre');
  }
  get celular_padre() {
    return this.formulario.get('celular_padre');
  }

  // Validación para formulario TEST
  get uno() {
    return this.formularioTest.get('uno');
  }

  public onSubmit(event: any) {

    this.estudiante = this.formulario.value;
    this.showTest = false;

    window.scroll({
      top: 0,
      // left: 100,
      behavior: 'auto'
    });
    console.log(this.estudiante);
  }

  public onSubmitTest(event: Event) {

    this.btnGuardar = false;
    // Verificar si todos los campos están marcados
    const respuestasArray = this.formularioTest.get('respuestas') as FormArray;

    const missingFields = respuestasArray.value.filter((value: any) => value === "");


    // Indices faltantes

    const newArray = respuestasArray.value.map((element: any, indice: any, arreglo: any) => {

      if (element === "") {
        return indice + 1;
      } else {
        return 'Marcado'
      }

    });


    // Entra aqui con las preguntas completas
    if (missingFields.length === 0) {

      function c_carrera_name(): string {
        return `<p>ADMINISTRACIÓN Y CONTABLES</p>`;
      }

      function h_carrera_name(): string {
        return `<p>HUMANÍSTICAS Y SOCIALES</p>`;
      }

      function a_carrera_name(): string {
        return `<p>ARTÍSTICAS</p>`;
      }

      function s_carrera_name(): string {
        return `<p>MEDICINA Y CIENCIAS DE LA SALUD</p>`;
      }

      function i_carrera_name(): string {
        return `<p>INGENIERÍA Y COMPUTACIÓN</p>`;
      }

      function d_carrera_name(): string {
        return `<p>DEFENSA Y SEGURIDAD</p>`;
      }

      function e_carrera_name(): string {
        return `<p>CIENCIAS EXACTAS Y AGRARIAS</p>`;
      }


      // Definiendo funciones INTERESES
      function c_carrera(): string {
        return `
        <ul>
          <li>LIC. EN ECONOMÍA</li>
          <li>LIC. EN CONTADURÍA PÚBLICA (AUDITORÍA)</li>
          <li>LIC. EN ADMINISTRACIÓN DE EMPRESAS</li>
          <li>LIC. EN ING. COMERCIAL</li>
          <li>LIC. EN ING. FINANCIERA</li>
          <li>LIC. EN TURISMO</li>
          <li>SECRETARIADO EJECUTIVO</li>
        </ul>
        `;

      }
      function h_carrera(): string {
        return `
        <ul>
          <li>LIC. EN PSICOLOGÍA</li>
          <li>LIC. EN CS. DE LA EDUCACIÓN</li>
          <li>LIC. EN LINGÜÍSTICA (IDIOMA INGLÉS)</li>
          <li>LIC. EN TRABAJO SOCIAL</li>
          <li>LIC. EN COMUNICACIÓN SOCIAL</li>
          <li>LIC. EN CIENCIAS POLÍTICAS</li>
          <li>LIC. EN CIENCIAS JURÍDICAS</li>
        </ul>
        `;
      }
      function a_carrera(): string {
        return `
        <ul>
          <li>ARQUITECTURA</li>
          <li>DISEÑO GRÀFICO</li>
          <li>DISEÑO DE INTERIORES</li>
        </ul>
        `;
      }
      function s_carrera(): string {
        return `
        <ul>
          <li>LIC. EN MEDICINA</li>
          <li>LIC. EN ENFERMERÍA</li>
          <li>LIC. EN ODONTOLOGÍA</li>
          <li>LIC. EN MEDICINA VETERINARIA Y ZOOTECNIA</li>
          <li>LIC. EN FISIOTERAPIA Y KINESIOLOGÍA</li>
          <li>LIC. EN BIOQUÍMICA Y FARMACIA</li>
        </ul>
        `;
      }
      function i_carrera(): string {
        return `
        <ul>
          <li>ING. CIVIL</li>
          <li>ING. ELÉCTRICA</li>
          <li>ING. INDUSTRIAL</li>
          <li>ING. INFORMÁTICA</li>
          <li>ING. EN SISTEMAS</li>
          <li>ING. ELECTRÓNICA</li>
          <li>ING. EN ALIMENTOS</li>
          <li>ING. ELECTROMECÁNICA</li>
          <li>ING. MECÁNICA</li>
          <li>ING. QUÍMICA</li>
          <li>ING. PETROQUÍMICA</li>
          <li>LIC. EN BIOLOGÍA, FÍSICA, MATEMÁTICAS Y QUÍMICA</li>
          <li>COMPUTACIÓN</li>
        </ul>
        `;
      }
      function d_carrera(): string {
        return `
        <ul>
          <li>COLEGIO MILITAR DEL EJÉRCITO</li>
          <li>COLEGIO MILITAR DE AVIACIÓN</li>
          <li>ESCUELA NAVAL MILITAR</li>
          <li>ANAPOL</li>
          <li>EMSE</li>
          <li>POLITÉCNICO MILITAR</li>
          <li>ESCUELA DE SARGENTOS DE LA ARMADA</li>
          <li>ESBAPOL</li>
        </ul>
        `;
      }
      function e_carrera(): string {
        return `
        <ul>
          <li>LIC. EN AGRONOMÍA</li>
          <li>LIC. AGROINDUSTRIAL</li>
          <li>LIC. AGRÍCOLA</li>
          <li>LIC. EN ZOOTECNIA</li>
          <li>LIC. EN ING. FORESTAL</li>
        </ul>
        `;
      }


      // Definiendo funciones INTERESES
      function c_interes(): string {
        return `
        <ol>
          <li>Organizativo</li>
          <li>Supervisión</li>
          <li>Orden</li>
          <li>Análisis y síntesis</li>
          <li>Colaboración</li>
          <li>Cálculo</li>
          <li>Liderazgo</li>
          <li>Participación Activa</li>
         </ol
        `;
      }
      function h_interes(): string {
        return `
        <ol>
          <li>Precisión Verbal</li>
          <li>Organización</li>
          <li>Relación de Hechos</li>
          <li>Lingüística</li>
          <li>Orden</li>
          <li>Justicia</li>
          <li>El Hombre Analítico</li>
        </ol>
        `;
      }
      function a_interes(): string {
        return `
          <ol>
            <li>Estético</li>
            <li>Armónico</li>
            <li>Manual</li>
            <li>Visual</li>
            <li>Auditivo</li>
            <li>Observación</li>
            <li>Análisis</li>
            <li>Senso-Perceptivo</li>
          </ol>
          `;
      }
      function s_interes(): string {
        return `
          <ol>
            <li>Asistir</li>
            <li>Investigativo</li>
            <li>Precisión</li>
            <li>Senso-Perceptivo</li>
            <li>Analítico</li>
            <li>Ayudar</li>
            <li>Curar</li>
            <li>Rehabilitar</li>
          </ol>
          `;
      }
      function i_interes(): string {
        return `
        <ol>
          <li>Cálculo</li>
          <li>Científico</li>
          <li>Manual</li>
          <li>Exacto</li>
          <li>Planificar</li>
          <li>Organizar</li>
          <li>Controlar</li>
        </ol>
        `;
      }
      function d_interes(): string {
        return `
        <ol>
          <li>Justicia</li>
          <li>Equidad</li>
          <li>Colaboración</li>
          <li>Espíritu de Equipo</li>
          <li>Liderazgo</li>
          <li>Coordinación</li>
          <li>Destreza Física</li>
        </ol>
        `;
      }
      function e_interes(): string {
        return `
        <ol>
          <li>Clasificar</li>
          <li>Numérico</li>
          <li>Análisis y Síntesis</li>
          <li>Organización</li>
          <li>Orden</li>
          <li>Investigación</li>
          <li>Precisión</li>
          <li>Exacto</li>
        </ol>
        `;
      }

      // Definiendo funciones APTITUDES
      function c_aptitudes(): string {
        return `
        <ol>
          <li>Persuasivo</li>
          <li>Objetivo</li>
          <li>Práctico</li>
          <li>Tolerante</li>
          <li>Responsable</li>
          <li>Ambicioso</li>
          <li>Dinámico</li>
          <li>Resolutivo</li>
        </ol>
        `;
      }
      function h_aptitudes(): string {
        return `
        <ol>
          <li>Responsable</li>
          <li>Justo</li>
          <li>Conciliador</li>
          <li>Persuasivo</li>
          <li>Sagaz</li>
          <li>Imaginativo</li>
          <li>Comprensivo</li>
          <li>Estabilidad Emocional</li>
        </ol>
        `;
      }
      function a_aptitudes(): string {
        return `
        <ol>
          <li>Sensible</li>
          <li>Imaginativo</li>
          <li>Creativo</li>
          <li>Detallista</li>
          <li>Innovador</li>
          <li>Intuitivo</li>
          <li>Paciente</li>
          <li>Espontáneo</li>
        </ol>
        `;
      }
      function s_aptitudes(): string {
        return `
        <ol>
          <li>Altruista</li>
          <li>Solidario</li>
          <li>Paciente</li>
          <li>Comprensivo</li>
          <li>Respetuoso</li>
          <li>Persuasivo</li>
          <li>Servicial</li>
          <li>Observador</li>
        </ol>
        `;
      }
      function i_aptitudes(): string {
        return `
        <ol>
          <li>Preciso</li>
          <li>Práctico</li>
          <li>Crítico</li>
          <li>Analítico</li>
          <li>Rígido</li>
          <li>Racional</li>
          <li>Independiente</li>
        </ol>
        `;
      }
      function d_aptitudes(): string {
        return `
        <ol>
          <li>Arriesgado</li>
          <li>Solidario</li>
          <li>Valiente</li>
          <li>Agresivo</li>
          <li>Persuasivo</li>
          <li>Aventurero</li>
          <li>Equilibrio</li>
          <li>Psíquico</li>
        </ol>
        `;
      }
      function e_aptitudes(): string {
        return `
        <ol>
          <li>Metódico</li>
          <li>Analítico</li>
          <li>Observador</li>
          <li>Introvertido</li>
          <li>Paciente</li>
          <li>Seguro</li>
          <li>Independiente</li>
          <li>Intuitivo</li>
        </ol>
        `;
      }





      let c_i: number = 0;
      let h_i: number = 0;
      let a_i: number = 0;
      let s_i: number = 0;
      let i_i: number = 0;
      let d_i: number = 0;
      let e_i: number = 0;

      let c_a: number = 0;
      let h_a: number = 0;
      let a_a: number = 0;
      let s_a: number = 0;
      let i_a: number = 0;
      let d_a: number = 0;
      let e_a: number = 0;

      let interes: any[] = [0, 0, 0, 0, 0, 0, 0];
      let aptitudes: any[] = [0, 0, 0, 0, 0, 0, 0];

      // Todos los campos están marcados, procede con la lógica de envío.
      const datosTest = this.formularioTest.value;


      (datosTest.respuestas).forEach((element: any, index: any) => {


        let num = index + 1;

        if (element === 'SI') {

          // INTERES
          // C_I_0
          if (num === 98 || num === 12 || num === 64 || num === 53 || num === 85 || num === 1 || num === 78 || num === 20 || num === 71 || num === 91) {
            c_i = c_i + 1;
            interes[0] = c_i;
          }
          // H_I_1
          if (num === 9 || num === 34 || num === 80 || num === 25 || num === 95 || num === 67 || num === 41 || num === 74 || num === 56 || num === 89) {
            h_i = h_i + 1;
            interes[1] = h_i;
          }
          // A_I_2
          if (num === 21 || num === 45 || num === 96 || num === 57 || num === 28 || num === 11 || num === 50 || num === 3 || num === 81 || num === 36) {
            a_i = a_i + 1;
            interes[2] = a_i;
          }
          // S_I_3
          if (num === 33 || num === 92 || num === 70 || num === 8 || num === 87 || num === 62 || num === 23 || num === 44 || num === 16 || num === 52) {
            s_i = s_i + 1;
            interes[3] = s_i;
          }
          // I_I_4
          if (num === 75 || num === 6 || num === 19 || num === 38 || num === 60 || num === 27 || num === 83 || num === 54 || num === 47 || num === 97) {
            i_i = i_i + 1;
            interes[4] = i_i;
          }
          // D_I_5
          if (num === 84 || num === 31 || num === 48 || num === 73 || num === 5 || num === 65 || num === 14 || num === 37 || num === 58 || num === 24) {
            d_i = d_i + 1;
            interes[5] = d_i;
          }
          // E_I_6
          if (num === 77 || num === 42 || num === 88 || num === 17 || num === 93 || num === 32 || num === 68 || num === 49 || num === 35 || num === 61) {
            e_i = e_i + 1;
            interes[6] = e_i;
          }

          // APTITUDES
          // C_A_0
          if (num === 15 || num === 51 || num === 2 || num === 46) {
            c_a = c_a + 1;
            aptitudes[0] = c_a;
          }
          // H_A_1
          if (num === 63 || num === 30 || num === 72 || num === 86) {
            h_a = h_a + 1;
            aptitudes[1] = h_a;
          }
          // A_A_2
          if (num === 22 || num === 39 || num === 76 || num === 82) {
            a_a = a_a + 1;
            aptitudes[2] = a_a;
          }
          // S_A_3
          if (num === 69 || num === 40 || num === 29 || num === 4) {
            s_a = s_a + 1;
            aptitudes[3] = s_a;
          }
          // I_A_4
          if (num === 26 || num === 59 || num === 90 || num === 10) {
            i_a = i_a + 1;
            aptitudes[4] = i_a;
          }
          // D_A_5
          if (num === 13 || num === 66 || num === 18 || num === 43) {
            d_a = d_a + 1;
            aptitudes[5] = d_a;
          }
          // E_E_6 
          if (num === 94 || num === 7 || num === 79 || num === 55) {
            e_a = e_a + 1;
            aptitudes[6] = e_a;
          }

        }

      });

      console.log('Interes: ', interes);
      console.log('Aptitudes: ', aptitudes);

      // Inicializar un nuevo vector para almacenar la suma
      let resultadoFinal = [];

      // Recorrer los vectores y sumar los elementos correspondientes
      for (let i = 0; i < interes.length; i++) {
        resultadoFinal.push(interes[i] + aptitudes[i]);
      }


      function encontrarPosicionesDelMaximo(arr: any[]): number[] {
        let maximo = Number.MIN_SAFE_INTEGER; // Inicializa el valor máximo con el valor mínimo seguro
        let posiciones: number[] = [];

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > maximo) {
            // Se encontró un nuevo valor máximo
            maximo = arr[i];
            posiciones = [i];
          } else if (arr[i] === maximo) {
            // Se encontró un elemento igual al valor máximo actual
            posiciones.push(i);
          }
        }
        return posiciones;
      }

      const posicionesDelMaximo = encontrarPosicionesDelMaximo(resultadoFinal);


      console.log("Posiciones maximo interes:", posicionesDelMaximo);

      let carrera_bd: string = '';
      let intereses_bd: string = '';
      let aptitudes_bd: string = '';
      let carreras_aptas_bd: string = '';


      let resultIntereses: string = '';

      // Interes
      switch (posicionesDelMaximo[0]) {

        // C
        case 0:
          carrera_bd = c_carrera_name();
          intereses_bd = c_interes();
          aptitudes_bd = c_aptitudes();
          carreras_aptas_bd = c_carrera();
          break;
        // H
        case 1:
          carrera_bd = h_carrera_name();
          intereses_bd = h_interes();
          aptitudes_bd = h_aptitudes();
          carreras_aptas_bd = h_carrera();
          break;
        // A
        case 2:
          carrera_bd = a_carrera_name();
          intereses_bd = a_interes();
          aptitudes_bd = a_aptitudes();
          carreras_aptas_bd = a_carrera();
          break;
        // S
        case 3:
          carrera_bd = s_carrera_name();
          intereses_bd = s_interes();
          aptitudes_bd = s_aptitudes();
          carreras_aptas_bd = s_carrera();
          break;
        // I
        case 4:
          carrera_bd = i_carrera_name();
          intereses_bd = i_interes();
          aptitudes_bd = i_aptitudes();
          carreras_aptas_bd = i_carrera();
          break;
        // D
        case 5:
          carrera_bd = d_carrera_name();
          intereses_bd = d_interes();
          aptitudes_bd = d_aptitudes();
          carreras_aptas_bd = d_carrera();
          break;
        // E
        case 6:
          carrera_bd = e_carrera_name();
          intereses_bd = e_interes();
          aptitudes_bd = e_aptitudes();
          carreras_aptas_bd = e_carrera();
          break;
        default:
          break;
      }

      const formData: datosTestInterface = {
        nombres: this.estudiante.nombres,
        sexo: this.estudiante.sexo,
        edad: this.estudiante.edad,
        celular: this.estudiante.celular,
        email: this.estudiante.email,
        nombre_madre: this.estudiante.nombre_madre,
        celular_madre: this.estudiante.celular_madre,
        nombre_padre: this.estudiante.nombre_padre,
        celular_padre: this.estudiante.celular_padre,
        carrera_bd: carrera_bd,
        intereses_bd: intereses_bd,
        aptitudes_bd: aptitudes_bd,
        carreras_aptas_bd: carreras_aptas_bd,
        datos_tests: resultadoFinal,
        pruebas_id: this.idTest
      }

      console.log(formData);


      // Guardarndo los datos
      this.testServices.storeTest(formData)
        .subscribe({
          next: (resp) => {
            this.btnGuardar = true;
            this.router.navigateByUrl('/felicitaciones');
          }
        })


      // Aqui guardando resultados en la base de datos
      console.log(resultIntereses);



    } else {
      // Mostrar un mensaje de error

      let faltantes: any[] = [];

      newArray.forEach((element: any) => {
        if (element != 'Marcado') {
          faltantes.push(element);
        }
      });
      Swal.fire({
        icon: 'error',
        title: 'Faltan campos por marcar',
        text: `${faltantes}`,
        footer: 'Test de orientación vocacional JACKBOLIVIA2000'
      })
      this.btnGuardar = true;

    }
  }

  /**
   * onEstadoRadioButtonChange(event)
   */
  public onEstadoRadioButtonChange(event: any) {
    console.log(event);

  }

  /**
   * validarHabilitado
   */
  public validarHabilitado() {

    this.pruebaServices.showPrueba(this.idTest)
      .subscribe(({ pruebas }) => {
        if (pruebas.estado != 'Habilitado') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Esta prueba no esta disponible',
            footer: '<p>Test Vocacional JacBolivia2000</p>'
          })
          this.router.navigateByUrl('/**')
        }

      })


  }

}
