import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../../shared/services/competitions/competition.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  competitions: any[] = [];
  error = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadMockData();
  }

  goToPage(): void {
    this.router.navigate(['/athlete']);
  }

  goToAthleteList(): void {
    this.router.navigate(['/athleteList']);
  }

  loadMockData(): void {
    this.competitions = [
      { id: 1, name: 'Campeonato de Futebol', type: 'Futebol', status: 'active' },
      { id: 2, name: 'Torneio de Tênis', type: 'Tênis', status: 'finished', winner: 'John Doe' },
      // ... outros dados mockados ...
    ];
  }

  // getCompetitions(): void {
  //   this.CompetitionService.getCompetitions().subscribe(
  //     (data: any) => {
  //       this.competitions = data;
  //     },
  //     (error: any) => {
  //       console.error('Erro ao buscar competições:', error);
  //     }
  //   );
  // }

}
