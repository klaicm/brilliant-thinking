import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/player/player.service';
import { Subscription } from 'rxjs';
import { Player } from './player.model';
import { Match } from './matches/match.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  playerId: number;
  player: Player;
  matches: Array<Match>;
  playerDetailsView = false;
  playerMatchesView = false;
  private sub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.getPlayerId();
    console.log('U ngOnInit() ' + this.matches);
    console.log('U ngOnInit() ' + this.player);
  }

  getPlayerId(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.playerId = +params['id'];
      this.getPlayer(this.playerId);
      this.getPlayerMatches(this.playerId);
    });
  }

  getPlayer(playerId: number): void {
    this.playerService.getPlayer(playerId).subscribe((response: Player) => {
      this.player = response;
      console.log(this.player);
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
