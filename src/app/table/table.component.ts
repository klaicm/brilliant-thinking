import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Player } from 'src/app/player/player.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  players: Array<Player>;

  constructor(private tableService: TableService) { }

  ngOnInit() {

      this.tableService.getTable().subscribe((response: Array<Player>) => {
        this.players = response;
        console.log(this.players.length);
      });
  }

}
