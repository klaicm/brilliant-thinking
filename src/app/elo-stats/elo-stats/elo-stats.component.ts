import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/player/player.service';
import { Player } from 'src/app/player/player.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Match } from 'src/app/player/matches/match.model';
import { MatTableDataSource } from '@angular/material';
import { SnackMessageService } from 'src/app/shared/services/snack-message.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-elo-stats',
  templateUrl: './elo-stats.component.html',
  styleUrls: ['./elo-stats.component.scss']
})
export class EloStatsComponent implements OnInit {

  allPlayers: Array<Player> = new Array<Player>();
  probabilityA: number;
  probabilityB: number;
  playerSelectFormGroup: FormGroup;
  positionAList: Array<number> = new Array<number>();
  eloRatingAList: Array<number> = new Array<number>();
  winPercentageAList: Array<number> = new Array<number>();
  positionBList: Array<number> = new Array<number>();
  eloRatingBList: Array<number> = new Array<number>();
  winPercentageBList: Array<number> = new Array<number>();
  matches: Array<Match>;
  positions: Object;
  eloRatings: Object;
  winPercentages: Object;
  probabilites: Object;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];
  playerAWins = 0;
  playerBWins = 0;
  panelOpenState = false;
  loadingPlayers = true;
  calculationLoader = false;
  showAllCharts = false;
  filteredOptionsA: Observable<string[]>;
  filteredOptionsB: Observable<string[]>;

  constructor(private playerService: PlayerService, private snackMessageService: SnackMessageService) {
    this.playerSelectFormGroup = new FormGroup({
      playerAFormControl: new FormControl('', Validators.required),
      playerBFormControl: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
        if (response) {
          this.allPlayers = response;
          this.loadingPlayers = false;
        } else {
          this.snackMessageService.showError('Greška kod dohvata igrača');
        }
      });
    }, 1500);

    this.filteredOptionsA = this.playerSelectFormGroup.get('playerAFormControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value)));

    this.filteredOptionsB = this.playerSelectFormGroup.get('playerBFormControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value)));
  }

  getEloStats() {
    const playerA: Player = this.playerSelectFormGroup.get('playerAFormControl').value;
    const playerB: Player = this.playerSelectFormGroup.get('playerBFormControl').value;

    if (playerA && playerB) {
      this.showAllCharts = true;
      this.calculationLoader = true;
      this.getPlayer(playerA.id, 'A');
      this.getPlayer(playerB.id, 'B');
      this.playerService.getEloStats(playerA.elo, playerB.elo).subscribe(response => {
        setTimeout(() => {
          if (response) {
            this.showAllCharts = true;
            this.calculationLoader = false;
            this.probabilityA = Math.round(response.ea * 100);
            this.probabilityB = Math.round(response.eb * 100);
            this.winProbabilityChart(this.probabilityA, this.probabilityB,
              playerA.lastName, playerB.lastName);
            this.positionChart(this.positionAList, this.positionBList,
              playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);
            this.winPercentageChart(this.winPercentageAList, this.winPercentageBList,
              playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);
            this.eloRatingChart(this.eloRatingAList, this.eloRatingBList,
              playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);
          } else {
            this.snackMessageService.showError('Greška kod izračuna vjerojatnosti pobjede.');
          }
        }, 1500);
      });

      this.getPlayerMatches(playerA.id, playerB.id);

    } else {
      this.snackMessageService.showError('Potreban unos oba igrača');
    }

  }

  openSnackBar(): void {
    this.snackMessageService.showError('Potreban unos oba igrača');
  }

  getPlayer(playerId: number, player: String): void {
    this.playerService.getPlayer(playerId).subscribe((response: Player) => {
      if (response) {
        if (player === 'A') {
          this.positionAList = [];
          this.eloRatingAList = [];
          this.winPercentageAList = [];
          response.archData.forEach(i => {
            this.positionAList.push(i.position);
            this.eloRatingAList.push(i.eloRating);
            this.winPercentageAList.push(i.winPercentage);
          });
        } else if (player === 'B') {
          this.positionBList = [];
          this.eloRatingBList = [];
          this.winPercentageBList = [];
          response.archData.forEach(i => {
            this.positionBList.push(i.position);
            this.eloRatingBList.push(i.eloRating);
            this.winPercentageBList.push(i.winPercentage);
          });
        }
      } else {
        this.snackMessageService.showError('Neuspješan dohvat igrača.');
      }
    });
  }

  getPlayerMatches(playerAId: number, playerBId: number): void {
    this.playerService.getPlayerMatches(playerAId).subscribe((response: Array<Match>) => {
      this.playerAWins = 0;
      this.playerBWins = 0;

      if (response) {
        this.matches = response;

        const mutualMatches = this.matches.filter(match => (match.playerL.id === playerBId || match.playerW.id === playerBId));

        if (mutualMatches) {
          mutualMatches.forEach(match => {
            if (match.playerW.id === playerAId) {
              this.playerAWins++;
            } else if (match.playerW.id === playerBId) {
              this.playerBWins++;
            }
          });
        }

        this.dataSource = new MatTableDataSource(mutualMatches);
      } else {
        this.snackMessageService.showError('Neuspješan dohvata mečeva.');
      }

    });
  }

  private _filter(value: any): any[] {
    const filterValue = value;
    return this.allPlayers.filter(option =>
      (option.firstName.includes(filterValue) || option.lastName.includes(filterValue))
    );
  }

  displayFn(val: Player) {
    return val ? val.firstName + ' ' + val.lastName : val;
  }

  positionChart(positionAList: Array<number>, positionBList: Array<number>, playerAName: String, playerBName: String): void {
    this.positions = {
      title: { text: 'Plasman kroz sezonu' },
      credits: {
        enabled: false
      },
      yAxis: {
        title: false,
        allowDecimals: false,
        reversed: true,
        showFirstLabel: true,
        showLastLabel: true
      },
      xAxis: {
        allowDecimals: false,
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              }
          }
      },
      series: [{
        name: playerAName,
        type: 'spline',
        color: '#B39DDB',
        data: positionAList,
      },
      {
        name: playerBName,
        type: 'spline',
        color: '#EF6C00',
        data: positionBList,
      }]
    };
  }

  winPercentageChart(winPercentageAList: Array<number>, winPercentageBList: Array<number>, playerAName: String, playerBName: String): void {
    this.winPercentages = {
      title: { text: 'Postotak pobjeda' },
      credits: {
        enabled: false
      },
      yAxis: {
        title: false,
        allowDecimals: false,
        min: 0,
        max: 100
      },
      xAxis: {
        allowDecimals: false,
      },
      series: [{
        name: playerAName,
        type: 'spline',
        color: '#00E676',
        data: winPercentageAList,
      },
      {
        name: playerBName,
        type: 'spline',
        color: '#616161',
        data: winPercentageBList,
      }]
    };
  }

  eloRatingChart(eloRatingAList: Array<number>, eloRatingBList: Array<number>, playerAName: String, playerBName: String): void {
    this.eloRatings = {
      title: { text: 'Elo rating' },
      credits: {
        enabled: false
      },
      yAxis: {
        title: false,
        allowDecimals: false,
        min: 750,
        tickInterval: 250
      },
      xAxis: {
        allowDecimals: false
      },
      shadow: true,
      series: [{
        name: playerAName,
        type: 'spline',
        color: '#81D4FA',
        data: eloRatingAList,
      },
      {
        name: playerBName,
        type: 'spline',
        color: '#FFAB91',
        data: eloRatingBList,
      }]
    };
  }

  winProbabilityChart(probabilityA: number, probabilityB: number, playerAName: String, playerBName: String) {
    this.probabilites = {
      title: { text: 'Vjerojatnost pobjede (na temelju ELO)' },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: 'black'
            }
          }
        }
      },
      series: [{
        type: 'pie',
        innerSize: '50%',
        data: [{
          name: playerAName,
          y: probabilityA,
          color: '#81D4FA'
        },
        {
          name: playerBName,
          y: probabilityB,
          color: '#FFCC80'
        }
        ]
      }]
    };
  }


}
