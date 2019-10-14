import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/player/player.service';
import { Player } from 'src/app/player/player.model';

@Component({
  selector: 'app-elo-stats',
  templateUrl: './elo-stats.component.html',
  styleUrls: ['./elo-stats.component.css']
})
export class EloStatsComponent implements OnInit {

  allPlayers: Array<Player> = new Array<Player>();
  probabilitiesMap: Map<String, number>;
  probabilityA: number;
  probabilityB: number;
  playerA: Player;
  playerB: Player;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
      this.allPlayers = response;
    })
  }

  getEloStats(playerA: Player, playerB: Player, playerAElo: number, playerBElo: number) {
    this.playerService.getEloStats(playerAElo, playerBElo).subscribe((response: Map<String, number>) => {
      this.probabilitiesMap = response;
      this.probabilityA = this.probabilitiesMap.get("ea")*100;
      this.probabilityB = this.probabilitiesMap.get("eb")*100;
    })

    this.playerA = this.allPlayers.find(player => player.id == playerA.id);
    this.playerB = this.allPlayers.find(player => player.id == playerB.id);

  }

}
