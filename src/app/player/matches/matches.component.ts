import { Component, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Match } from './match.model';
import { Player } from 'src/app/player/player.model';
import { PlayerService } from 'src/app/player/player.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnChanges {

  @Input() matches: Array<Match>;
  @Input() player: Player;

  cPlayer: Player = new Player();

  match: Match = new Match;

  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private cdref: ChangeDetectorRef, private playerService: PlayerService) { }

  testSaveMatch(): void {
    let playerWon = new Player;
    let playerLost = new Player;

    playerWon.id = 1;

    playerLost.id = 2;
    this.match.result = '6:4 6:2';

    this.match.playerW = playerWon;
    this.match.playerL = playerLost;

    this.playerService.saveMatch(this.match).subscribe(response => {
      const listen = response;
      console.log(this.match)
    });
  }

  ngOnChanges() {
    if (this.matches) {
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;
    }

    if (this.player) {
      this.cPlayer = this.player;
    }
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }

}
