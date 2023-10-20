import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  public nowDate = new Date();
  public anio!: number;

  constructor() {
    this.anio = this.nowDate.getFullYear();
  }

}
