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
    this.router.navigate(['/player', playerId]).then(() => {
      window.location.reload();
    });
  }

}
