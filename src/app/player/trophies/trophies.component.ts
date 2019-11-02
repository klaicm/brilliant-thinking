import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Player } from '../player.model';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.scss']
})
export class TrophiesComponent implements OnInit {

  @Input() player: Player;

  totalWins: number;
  totalPlayed: number;
  cPlayer: Player = new Player();

  tenWinsBadge: String = '../../../assets/images/10wins.PNG';
  trophyFiftyWins: String = '../../../assets/images/tr50wins.png';
  trophy100wins: String = '../../../assets/images/tr100wins.png';
  mastersWinner: String = '../../../assets/images/mastersWinner.png';
  grandTrophy3: String = '../../../assets/images/grandTrophy3.png';
  grandTrophy4: String = '../../../assets/images/grandTrophy4.png';
  grandTrophy5: String = '../../../assets/images/grandTrophy5.png';
  grandTrophy6: String = '../../../assets/images/grandTrophy6.png';
  medal1: String = '../../../assets/images/medal1.png';
  medal2: String = '../../../assets/images/medal2.png';
  medal3: String = '../../../assets/images/medal3.png';
  medal4: String = '../../../assets/images/medal4.png';
  medal5: String = '../../../assets/images/medal5.png';
  medal6: String = '../../../assets/images/medal6.png';
  medal7: String = '../../../assets/images/medal7.png';
  medal8: String = '../../../assets/images/medal8.png';
  playerTrophy1: String = '../../../assets/images/playerTrophy1.png';
  playerTrophy2: String = '../../../assets/images/playerTrophy2.png';
  playerTrophy3: String = '../../../assets/images/playerTrophy3.png';
  playerTrophy4: String = '../../../assets/images/playerTrophy4.png';
  playerTrophy5: String = '../../../assets/images/playerTrophy5.png';
  honor1: String = '../../../assets/images/honor1.png';
  honor2: String = '../../../assets/images/honor2.png';

  constructor() { }

  ngOnInit() {
    if (this.player) {
      this.cPlayer = this.player;
      this.totalWins = this.player.winsInTb + this.player.winsInTwo;
      this.totalPlayed = this.player.winsInTb + this.player.winsInTwo + this.player.losesInTwo + this.player.losesInTb;
    }
  }

}
