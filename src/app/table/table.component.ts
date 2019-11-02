import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Player } from 'src/app/player/player.model';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';
import { SnackMessageService } from '../shared/services/snack-message.service';
import { TableElement } from './table.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'points', 'elo',
    'percentage', 'totalPlayed', 'winsInTwo', 'winsInTb', 'losesInTb', 'losesInTwo'];
  players: Array<Player>;
  dataSource = new MatTableDataSource([]);
  loadingTable = true;
  table: Array<TableElement>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private tableService: TableService, private router: Router, private snackMessageService: SnackMessageService) { }

  ngOnInit() {
    setTimeout(() => {
      this.tableService.getTable().subscribe((response: Array<Player>) => {
        if (response) {
          this.loadingTable = false;
          this.players = response;
          const tableElements = this.createTableData(this.players);
          this.dataSource = new MatTableDataSource(tableElements);
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          });
        } else {
          this.snackMessageService.showError('Greška kod poziva servisa za dohvat tablice.');
        }
      });
    }, 1000);
  }

  navigateToPlayer(playerId: number): void {
    this.router.navigate(['/player', playerId]);
  }

  createTableData(players: Array<Player>): Array<TableElement> {
    const table = new Array<TableElement>();
    players.forEach(player => {
      const tableElement = new TableElement;
      tableElement.id = player.id;
      tableElement.firstName = player.firstName;
      tableElement.lastName = player.lastName;
      tableElement.elo = player.elo;
      tableElement.winsInTwo = player.winsInTwo;
      tableElement.winsInTb = player.winsInTb;
      tableElement.losesInTb = player.losesInTb;
      tableElement.losesInTwo = player.losesInTwo;
      tableElement.points = player.points;
      tableElement.totalPlayed = player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo;
      if (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo === 0) {
        tableElement.percentage = 0;
      } else {
        tableElement.percentage =
          ((tableElement.winsInTb + tableElement.winsInTwo) /
            (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo)) * 100;
      }

      table.push(tableElement);
    });

    return table;
  }

}
