import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  lineChartPath: String = '../../assets/images/line_chart.PNG';
  lineChartTwoPath: String = '../../assets/images/line_chart2.PNG';
  pieChartPath: String = '../../assets/images/pie_chart.PNG';

  constructor() { }

  ngOnInit() {
  }

}
