import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../player.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html'
})
export class MatchesComponent implements OnInit {

    playerId: number;
    matches: Array<any>;
    sub: Subscription;

  constructor(private playerService: PlayerService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getPlayerId();
  }

  getPlayerId(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.playerId = +params['id'];
      this.getPlayerMatches(this.playerId);
    })
  }

  getPlayerMatches(playerId: number): void {
    this.playerService.getPlayerMatches(playerId).subscribe((response: Array<any>) => {
        this.matches = response;
      });
  }

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }
}
