import { Component, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Match } from './match.model';
import { Player } from 'src/app/player/player.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnChanges {

  @Input() matches: Array<Match>;
  @Input() player: Player;

  cPlayer: Player = new Player();

  displayedColumns: string[] = ['playerWon', 'playerLost', 'result', 'date'];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private cdref: ChangeDetectorRef) { }

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
