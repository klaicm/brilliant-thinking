import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/player/player.service';
import { Subscription } from 'rxjs';
import { Player } from './player.model';
import { Match } from './matches/match.model';
import { SnackMessageService } from '../shared/services/snack-message.service';

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
  profilePic: String = '../../../assets/images/profile_unknown.png';
  loadingPlayer = true;
  loadingMatches = true;

  constructor(private activatedRoute: ActivatedRoute, private playerService: PlayerService,
    private snackMessageService: SnackMessageService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.playerId = +params['id'];
      this.getPlayer(this.playerId);
    });
  }

  getPlayer(playerId: number): void {
    setTimeout(() => {
      this.playerService.getPlayer(playerId).subscribe((response: Player) => {
        if (response) {
          this.player = response;
          this.loadingPlayer = false;
          this.getPlayerMatches(this.playerId);
        } else {
          this.snackMessageService.showError('Greška kod poziva servisa za dohvat igrača.');
        }
      });
    }, 1000);
  }

  getPlayerMatches(playerId: number): void {
    this.playerService.getPlayerMatches(playerId).subscribe((response: Array<Match>) => {
      if (response) {
        this.matches = response;
        this.loadingMatches = false;
      } else {
        this.snackMessageService.showError('Greška kod poziva servisa za dohvat igrača.');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
