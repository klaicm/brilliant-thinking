import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from 'src/app/player/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  lineChartPath: String = '../../assets/images/line_chart.PNG';
  lineChartTwoPath: String = '../../assets/images/line_chart2.PNG';
  pieChartPath: String = '../../assets/images/pie_chart.PNG';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private playerService: PlayerService) { }

  ngOnInit() {
  }

  navigateToPlayer(playerId: number) {
    this.router.navigate(['../player'])
  }

}
