import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Match } from 'src/app/player/matches/match.model';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  winPercentage: Object;
  playerMatches: Object;
  winsInRow: Object;
  eloRating: Object;
  pointsPerMatch: Object;
  matchesPerDay: Object;
  matches: Array<Match>;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];
  panelOpenState = false;
  allPlayers: Array<Player>;
  firstEightByPoints: Array<Player>;
  firstEightByElo: Array<Player>;
  firstEightByMatches: Array<Player>;
  firstEightByWinPercentage: Array<Player>;
  firstEightByPpg: Array<Player>;
  matchesPerDayMap: Map<String, number> = new Map<String, number>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private tableService: TableService, private playerService: PlayerService, private router: Router) { }

  ngOnInit() {

    this.tableService.getAllMatches().subscribe((response: Array<Match>) => {
      this.matches = response;
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;

      this.matchesPerDayMap.set('Monday', this.matches.filter(match => new Date(match.date).getDay() == 1).length);
      this.matchesPerDayMap.set('Tuesday', this.matches.filter(match => new Date(match.date).getDay() == 2).length);
      this.matchesPerDayMap.set('Wednesday', this.matches.filter(match => new Date(match.date).getDay() == 3).length);
      this.matchesPerDayMap.set('Thursday', this.matches.filter(match => new Date(match.date).getDay() == 4).length);
      this.matchesPerDayMap.set('Friday', this.matches.filter(match => new Date(match.date).getDay() == 5).length);
      this.matchesPerDayMap.set('Saturday', this.matches.filter(match => new Date(match.date).getDay() == 6).length);
      this.matchesPerDayMap.set('Sunday', this.matches.filter(match => new Date(match.date).getDay() == 0).length);
    });

    this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
      this.allPlayers = response;
      let playersWithMinTenMatches: Array<Player> = new Array<Player>();

      playersWithMinTenMatches = this.allPlayers.filter(player => (player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo) >= 10);
      this.firstEightByElo = playersWithMinTenMatches.sort((a, b) => (a.elo > b.elo) ? -1 : 1).slice(0, 8);
      this.firstEightByMatches = this.allPlayers.sort((a, b) =>
        ((a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > (b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb)) ?
          -1 : 1).slice(0, 8);
      this.firstEightByWinPercentage = playersWithMinTenMatches.sort((a, b) =>
        ((a.winsInTb + a.winsInTwo)/(a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > 
        ((b.winsInTb + b.winsInTwo)/(b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb))) ?
          -1 : 1).slice(0, 8);
      this.firstEightByPpg = playersWithMinTenMatches.sort((a, b) => 
        (a.points/(a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > 
        b.points/(b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb)) ? -1 : 1).slice(0, 8);
    });
  }

  ngAfterViewInit(): void {
    this.matchesPerDayChart();
    this.playerMatchesChart();
    // this.winsInRowChart();
    this.eloRatingChart();
    this.winPercentageChart();
    this.pointsPerMatchChart()

  }

  winPercentageChart(): void {
    this.winPercentage = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Postotak pobjeda'
      },
      yAxis: {
        title: false
      },
      xAxis: {
        categories: this.firstEightByWinPercentage.map(player => (player.firstName.substring(0, 1) + '. ' + player.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Postotak pobjeda (min. 10 odigranih)',
        data: this.firstEightByWinPercentage.map(player => 
          Math.round(((player.winsInTb + player.winsInTwo)/(player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo))*100))
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
      yAxis: {
        title: false
      },
      xAxis: {
        categories: this.firstEightByMatches.map(player => (player.firstName.substring(0, 1) + '. ' + player.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Broj mečeva',
        // data: [25, 22, 16, 10, 10],
        data: this.firstEightByMatches.map(player => (player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo)),
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
      yAxis: {
        title: false
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
      yAxis: {
        title: false
      },
      xAxis: {
        categories: this.firstEightByElo.map(player => (player.firstName.substring(0, 1) + '. ' + player.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Elo rating (min. 10 odigranih)',
        data: this.firstEightByElo.map(player => player.elo),
        color: '#4527a0'
      }]
    };
  }

  pointsPerMatchChart(): void {
    this.pointsPerMatch = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Prosjek bodova po meču'
      },
      yAxis: {
        title: false
      },
      xAxis: {
        categories: this.firstEightByPpg.map(player => (player.firstName.substring(0, 1) + '. ' + player.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Bodovi po meču (min. 10 odigranih)',
        // data: [25, 22, 16, 10, 10],
        data: this.firstEightByPpg.map(player => (player.points/(player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo))),
        color: '#ef6c00'
      }]
    };
  }

  matchesPerDayChart(): void {
    this.matchesPerDay = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Odigrani mečevi po danu'
      },
      yAxis: {
        title: false
      },
      xAxis: {
        categories: ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Odigrano mečeva',        
        data: [this.matchesPerDayMap.get('Monday'), this.matchesPerDayMap.get('Tuesday'), this.matchesPerDayMap.get('Wednesday'), 
          this.matchesPerDayMap.get('Thursday'), this.matchesPerDayMap.get('Friday'), this.matchesPerDayMap.get('Saturday'), 
          this.matchesPerDayMap.get('Sunday')],
        color: '#AD1457'
      }]
    };
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }
}
