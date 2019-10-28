import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Player } from 'src/app/player/player.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'points', 'elo', 
    'percentage', 'winsInTwo', 'winsInTb', 'losesInTb', 'losesInTwo', 'played'];
  players: Array<Player>;
  dataSource = new MatTableDataSource([]);
  loadingTable = true;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private tableService: TableService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.tableService.getTable().subscribe((response: Array<Player>) => {
        if (response) {
          this.loadingTable = false;
          this.players = response;
          this.dataSource = new MatTableDataSource(this.players);
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          });
        } else {
          console.error('Greška kod poziva servisa za dohvat tablice. Table Component.');
        }
      });
    }, 1000);
  }

  navigateToPlayer(playerId: number): void {
      this.router.navigate(['/player', playerId]);
  }

}
