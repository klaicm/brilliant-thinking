import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/table/table.service';
import { Player } from 'src/app/player/player.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  players: Array<Player>;

  constructor(private tableService: TableService, private router: Router) { }

  ngOnInit() {

      this.tableService.getTable().subscribe((response: Array<Player>) => {
        this.players = response;
        console.log(this.players.length);
      });
  }

  navigateToPlayer(playerId: number): void {
      this.router.navigate(['/player', playerId]);
  }

}
