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

  gamesPerDay: Object;
  playerMatches: Object;
  winsInRow: Object;
  eloRating: Object;
  matches: Array<Match>;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];
  panelOpenState = false;
  allPlayers: Array<Player>;
  firstEightByPoints: Array<Player>;
  firstEightByElo: Array<Player>;
  firstEightByMatches: Array<Player>;
  firstEightByWinPercentage: Array<Player>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private tableService: TableService, private playerService: PlayerService, private router: Router) { }

  ngOnInit() {

    this.tableService.getAllMatches().subscribe((response: Array<Match>) => {
      this.matches = response;
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;
    });

    this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
      this.allPlayers = response;
      this.firstEightByPoints = this.allPlayers.sort((a, b) => (a.points > b.points) ? 1 : -1).slice(0, 8);
      this.firstEightByElo = this.allPlayers.sort((a, b) => (a.elo > b.elo) ? -1 : 1).slice(0, 8);
      this.firstEightByMatches = this.allPlayers.sort((a, b) =>
        ((a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > (b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb)) ?
          -1 : 1).slice(0, 8);
      this.firstEightByWinPercentage = this.allPlayers.sort((a, b) =>
        ((a.winsInTb + a.winsInTwo)/(a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > 
        ((b.winsInTb + b.winsInTwo)/(b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb))) ?
          -1 : 1).slice(0, 8);
      console.log(this.firstEightByMatches.map(match => match.firstName));
      console.log(this.firstEightByMatches.map(match => match.matches));
    });
  }

  ngAfterViewInit(): void {
    this.gamesPerDayChart();
    this.playerMatchesChart();
    this.winsInRowChart();
    this.eloRatingChart();
    // this.winPercentageChart();
  }

  gamesPerDayChart(): void {
    this.gamesPerDay = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Postotak pobjeda'
      },
      xAxis: {
        categories: this.firstEightByWinPercentage.map(player => player.firstName + ' ' + player.lastName)
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Ponedjeljak',
        data: this.firstEightByWinPercentage.map(player => 
          ((player.winsInTb + player.winsInTwo)/(player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo))*100)
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
        categories: this.firstEightByMatches.map(match => (match.firstName + ' ' + match.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Broj mečeva',
        // data: [25, 22, 16, 10, 10],
        data: this.firstEightByMatches.map(match => (match.winsInTb + match.winsInTwo + match.losesInTb + match.losesInTwo)),
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
        categories: this.firstEightByElo.map(match => (match.firstName + ' ' + match.lastName))
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Elo rating',
        data: this.firstEightByElo.map(match => match.elo),
        color: '#4527a0'
      }]
    };
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }
}
