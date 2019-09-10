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
  lineChartPath: String = '../../assets/images/line_chart.PNG';
  lineChartTwoPath: String = '../../assets/images/line_chart2.PNG';
  pieChartPath: String = '../../assets/images/pie_chart.PNG';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private playerService: PlayerService) { }

  private sub: Subscription;
  ngOnInit() {
    this.getPlayerId();
  }

  getPlayerId(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.playerId = +params['id'];
      this.getPlayer(this.playerId);
    })
  }

  getPlayer(playerId: number): void {
    this.playerService.getPlayer(playerId).subscribe((response: Player) => {
      this.player = response;
    });
  }

  navigateToPlayerMatches(playerId: number): void {
    this.router.navigate(['/matches', playerId]);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
