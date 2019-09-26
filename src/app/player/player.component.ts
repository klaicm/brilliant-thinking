import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/player/player.service';
import { Subscription } from 'rxjs';
import { Player } from './player.model';
import { Match } from './matches/match.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {

  playerId: number;
  player: Player;
  matches: Array<Match>;
  playerDetailsView = false;
  playerMatchesView = false;
  private sub: Subscription;
  profilePic: String = '../../../assets/images/profile1.png';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.getPlayerId();
  }

  getPlayerId(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.playerId = +params['id'];
      this.getPlayer(this.playerId);
    });
  }

  getPlayer(playerId: number): void {
    this.playerService.getPlayer(playerId).subscribe((response: Player) => {
      this.player = response;
      this.getPlayerMatches(this.playerId);
    });
  }

  getPlayerMatches(playerId: number): void {
    this.playerService.getPlayerMatches(playerId).subscribe((response: Array<Match>) => {
        this.matches = response;
        console.log(this.matches);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
