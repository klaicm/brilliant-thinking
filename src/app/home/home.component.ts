import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Match } from 'src/app/player/matches/match.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  gamesPerDay: Object;
  playerMatches: Object;
  winsInRow: Object;
  eloRating: Object;
  matches: Array<Match>;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private tableService: TableService, private router: Router) { }

  ngOnInit() {

    this.tableService.getAllMatches().subscribe((response: Array<Match>) => {
      this.matches = response;
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;
    });

    this.gamesPerDayChart();
    this.playerMatchesChart();
    this.winsInRowChart();
    this.eloRatingChart();
  }

  gamesPerDayChart(): void {
    this.gamesPerDay = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Mečeva po danima'
      },
      xAxis: {
        categories: ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Ponedjeljak',
        data: [25, 38, 14, 27, 21, 30, 28]
      }]
    };
  }

  playerMatchesChart(): void {
    this.playerMatches = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Broj odigranih mečeva'
      },
      xAxis: {
        categories: ['Marko Marić', 'Ivan Ivić', 'Luka Lukić', 'Pero Perić', 'Tomo Tomić']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Broj mečeva',
        data: [25, 22, 16, 10, 10],
        color: '#CCFF90'
      }]
    };
  }

  winsInRowChart(): void {
    this.winsInRow = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Niz pobjeda'
      },
      xAxis: {
        categories: ['Ivan Ivić', 'Marko Marić', 'Tomo Tomić', 'Pero Perić', 'Luka Lukić']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Broj pobjeda',
        data: [7, 4, 3, 3, 1],
        color: '#ef6c00'
      }]
    };
  }

  eloRatingChart(): void {
    this.eloRating = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Elo rating'
      },
      xAxis: {
        categories: ['Luka Lukić, ', 'Pero Perić', 'Tomo Tomić', 'Marko Marić', 'Ivan Ivić']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Elo rating',
        data: [2125, 1938, 1914, 1727, 1621],
        color: '#4527a0'
      }]
    };
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
}
}
