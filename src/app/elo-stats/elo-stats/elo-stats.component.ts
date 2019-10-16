import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/player/player.service';
import { Player } from 'src/app/player/player.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Match } from 'src/app/player/matches/match.model';
import { MatTableDataSource } from '@angular/material';

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
  playerAWins: number = 0;
  playerBWins: number = 0;
  panelOpenState = false;

  constructor(private playerService: PlayerService) {
    this.playerSelectFormGroup = new FormGroup({
      playerAFormControl: new FormControl(),
      playerBFormControl: new FormControl()
    });
  }

  ngOnInit() {
    this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
      this.allPlayers = response;
    });

    this.playerSelectFormGroup.get('playerAFormControl').valueChanges.subscribe((value: Player) => {
      this.getPlayer(value.id, 'A');
    });

    this.playerSelectFormGroup.get('playerBFormControl').valueChanges.subscribe((value: Player) => {
      this.getPlayer(value.id, 'B');
    });
  }

  getEloStats() {
    let playerA: Player = this.playerSelectFormGroup.get("playerAFormControl").value;
    let playerB: Player = this.playerSelectFormGroup.get("playerBFormControl").value;

    if (playerA && playerB) {
      this.playerService.getEloStats(playerA.elo, playerB.elo).subscribe(response => {
        this.probabilityA = Math.round(response.ea * 100);
        this.probabilityB = Math.round(response.eb * 100);
        this.winProbabilityChart(this.probabilityA, this.probabilityB,
          playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName)
      })

      this.getPlayerMatches(playerA.id, playerB.id);

      this.positionChart(this.positionAList, this.positionBList,
        playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);
      this.winPercentageChart(this.winPercentageAList, this.winPercentageBList,
        playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);
      this.eloRatingChart(this.eloRatingAList, this.eloRatingBList,
        playerA.firstName + ' ' + playerA.lastName, playerB.firstName + ' ' + playerB.lastName);

    } else {

    }

  }

  getPlayer(playerId: number, player: String): void {
    this.playerService.getPlayer(playerId).subscribe((response: Player) => {
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
    });
  }

  getPlayerMatches(playerAId: number, playerBId: number): void {
    this.playerService.getPlayerMatches(playerAId).subscribe((response: Array<Match>) => {
      this.playerAWins = 0;
      this.playerBWins = 0;
      this.matches = response;

      let mutualMatches = this.matches.filter(match => (match.playerL.id === playerBId || match.playerW.id == playerBId));

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
    });
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
    }
  }


}
