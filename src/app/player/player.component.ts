import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/player/player.service';
import { Subscription } from 'rxjs';
import { Player } from './player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {

  playerId: number;
  player: Player;
  matches: Array<any>;
  playerDetailsView = false;
  playerMatchesView = false;
  lineChartPath: String = '../../assets/images/line_chart.PNG';
  lineChartTwoPath: String = '../../assets/images/line_chart2.PNG';
  pieChartPath: String = '../../assets/images/pie_chart.PNG';
  private sub: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private playerService: PlayerService) { }

  ngOnInit() {
    this.getPlayerId();
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
    });
  }

  getPlayerMatches(playerId: number): void {
    this.playerService.getPlayerMatches(playerId).subscribe((response: Array<any>) => {
        this.matches = response;
      });
  }

  navigateToPlayerDetails(): void {
    this.playerDetailsView = true;
    this.playerMatchesView = false;
  }

  navigateToPlayerMatches(): void {
    this.playerMatchesView = true;
    this.playerDetailsView = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
