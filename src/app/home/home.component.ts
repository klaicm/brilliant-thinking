import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Match } from 'src/app/player/matches/match.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player.model';
import { SnackMessageService } from '../shared/services/snack-message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  winPercentage: Object;
  playerMatches: Object;
  eloRating: Object;
  pointsPerMatch: Object;
  matchesPerDay: Object;
  matches: Array<Match> = [];
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];
  panelOpenState = false;
  allPlayers: Array<Player> = [];
  firstEightByElo: Array<Player> = [];
  firstEightByMatches: Array<Player> = [];
  firstEightByWinPercentage: Array<Player> = [];
  firstEightByPpg: Array<Player> = [];
  matchesPerDayMap: Map<String, number> = new Map<String, number>();
  matchesLength: number;
  allPlayersLength: number;
  loadingPlayers = true;
  loadingMatches = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private tableService: TableService, private playerService: PlayerService, private router: Router,
    private cdRef: ChangeDetectorRef, private snackMessageService: SnackMessageService) { }

  ngOnInit() {
    this.getAllPlayers();
    this.getAllMatches();
  }

  ngAfterViewInit(): void {

    this.cdRef.detectChanges();
  }

  getAllPlayers(): void {
    setTimeout(() => {
      this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {

        if (response) {
          this.loadingPlayers = false;
          this.allPlayers = response;

          const playersWithMinTenMatches = this.allPlayers.filter(player =>
            (player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo) >= 10);

          this.setAllFirstEights(playersWithMinTenMatches);
          this.playerMatchesChart();
          this.eloRatingChart();
          this.winPercentageChart();
          this.pointsPerMatchChart();
        } else {
          this.snackMessageService.showError('Greška kod poziva servisa za dohvat igrača.');
        }

      });
    }, 1000);
  }

  getAllMatches(): void {
    this.tableService.getAllMatches().subscribe((response: Array<Match>) => {
      if (response) {
        this.loadingMatches = false;
        this.matches = response;

        this.dataSource = new MatTableDataSource(this.matches);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          });
        }, 1000);
        this.setMatchesByDaysPerWeek(this.matches);
        this.matchesPerDayChart();
      } else {
        this.snackMessageService.showError('Greška kod poziva servisa za dohvat mečeva');
      }
    });
  }

  setAllFirstEights(playersWithMinTenMatches: Array<Player>): void {
    this.firstEightByMatches = this.allPlayers.sort((a, b) =>
      ((a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) > (b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb)) ?
        -1 : 1).slice(0, 8);

    this.firstEightByElo = playersWithMinTenMatches.sort((a, b) => (a.elo > b.elo) ? -1 : 1).slice(0, 8);

    this.firstEightByWinPercentage = playersWithMinTenMatches.sort((a, b) =>
      ((a.winsInTb + a.winsInTwo) / (a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) >
        ((b.winsInTb + b.winsInTwo) / (b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb))) ?
        -1 : 1).slice(0, 8);

    this.firstEightByPpg = playersWithMinTenMatches.sort((a, b) =>
      (a.points / (a.winsInTb + a.winsInTwo + a.losesInTb + a.losesInTwo) >
        b.points / (b.winsInTb + b.winsInTwo + b.losesInTwo + b.losesInTb)) ? -1 : 1).slice(0, 8);
  }

  setMatchesByDaysPerWeek(allMatches: Array<Match>): void {
    this.matchesPerDayMap.set('Monday', allMatches.filter(match => new Date(match.date).getDay() === 1).length);
    this.matchesPerDayMap.set('Tuesday', allMatches.filter(match => new Date(match.date).getDay() === 2).length);
    this.matchesPerDayMap.set('Wednesday', allMatches.filter(match => new Date(match.date).getDay() === 3).length);
    this.matchesPerDayMap.set('Thursday', allMatches.filter(match => new Date(match.date).getDay() === 4).length);
    this.matchesPerDayMap.set('Friday', allMatches.filter(match => new Date(match.date).getDay() === 5).length);
    this.matchesPerDayMap.set('Saturday', allMatches.filter(match => new Date(match.date).getDay() === 6).length);
    this.matchesPerDayMap.set('Sunday', allMatches.filter(match => new Date(match.date).getDay() === 0).length);
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
          Math.round(((player.winsInTb + player.winsInTwo) /
            (player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo)) * 100))
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

  eloRatingChart(): void {
    this.eloRating = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Elo rating'
      },
      reflow: true,
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
        color: '#BA68C8'
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
      reflow: true,
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
        data: this.firstEightByPpg.map(player => (player.points /
          (player.winsInTb + player.winsInTwo + player.losesInTb + player.losesInTwo))),
        color: '#E57373'
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
      reflow: true,
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
        color: '#FFB74D'
      }]
    };
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }
}
