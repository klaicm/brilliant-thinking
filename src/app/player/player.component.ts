import { Component, OnInit } from '@angular/core';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  lineChartPath: string = '../../assets/images/line_chart.PNG';
  lineChartTwoPath: string = '../../assets/images/line_chart2.PNG';
  pieChartPath: string = '../../assets/images/pie_chart.PNG';
  playerData: any;

  constructor(private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.getPlayerData().subscribe(response => {
      console.log(response);
      this.playerData = response;
    })
  }

}
