import { Component, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Match } from './match.model';
import { Player } from 'src/app/player/player.model';
import { PlayerService } from 'src/app/player/player.service';
import { SnackMessageService } from 'src/app/shared/services/snack-message.service';

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
  displayedColumns: string[] = ['mark', 'opponent', 'result', 'date'];
  dataSource = new MatTableDataSource([]);
  responseListener = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private playerService: PlayerService, private snackMessageService: SnackMessageService) { }

  testSaveMatch(): void {
    const playerWon = new Player;
    const playerLost = new Player;

    playerWon.id = 1;

    playerLost.id = 2;
    this.match.result = '6:4 6:2';

    this.match.playerW = playerWon;
    this.match.playerL = playerLost;

    this.playerService.saveMatch(this.match).subscribe(response => {
      this.responseListener = true;
      setTimeout(() => {
        const listen = response;
        if (response) {
          this.responseListener = false;
        } else {
          this.snackMessageService.showError('Nije uspješno spremljeno.');
        }
      }, 3000);
    });
  }

  ngOnChanges() {
    if (this.matches) {
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    if (this.player) {
      this.cPlayer = this.player;
    }
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }

}
