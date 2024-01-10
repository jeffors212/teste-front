import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-atletas',
  templateUrl: './lista-atletas.component.html',
  styleUrls: ['./lista-atletas.component.scss']
})
export class ListaAtletasComponent implements OnInit {

  Atletas: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    this.Atletas = [
      { id: 1, nome: 'Atleta 1', idade: 25, especialidade: 'Corrida' },
      { id: 2, nome: 'Atleta 2', idade: 30, especialidade: 'Natação' },
      // ... outros dados mockados ...
    ];
  }

}
