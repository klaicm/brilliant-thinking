import { Component, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Match } from './match.model';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html'
})
export class MatchesComponent implements OnChanges {

  @Input() matches: Array<Match>;

  displayedColumns: string[] = ['firstName', 'lastName', 'result', 'date'];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private cdref: ChangeDetectorRef) { }

  ngOnChanges() {
    if (this.matches) {
      this.dataSource = new MatTableDataSource(this.matches);
      this.dataSource.sort = this.sort;
      console.log(this.matches)
    }
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }

}
