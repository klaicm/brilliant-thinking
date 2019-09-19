import { Component, Input } from '@angular/core';
import { PlayerComponent } from 'src/app/player/player.component';
import { Player } from 'src/app/player/player.model';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

    @Input() player: Player;
    @Input() matches: Array<any>;

    position: Object;
    winPercentage: Object;
    eloRating: Object;
    resultsPie: Object;
    gamesPerWeek: Object;

    constructor() {

        this.resultsPie = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Ishodi mečeva'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Ishod',
                colorByPoint: true,
                data: [{
                    name: 'Pobjeda 2:0',
                    y: 55,
                    color: '#b2ff59',
                    sliced: true,
                    selected: true
                }, {
                    name: 'Pobjeda tie-break',
                    y: 25,
                    color: '#eeff41',
                }, {
                    name: 'Poraz 0:2',
                    y: 10,
                    color: '#fbc02d',
                }, {
                    name: 'Poraz tie-break',
                    y: 10,
                    color: '#ef6c00',
                }]
            }]
        };

        this.position = {
            title: { text: 'Plasman kroz sezonu' },
            yAxis: {
                reversed: true,
                showFirstLabel: false,
                showLastLabel: true
            },
            series: [{
                type: 'spline',
                color: '#4527a0',
                data: [60, 45, 15, 26, 10, 5],
            }]
        };

        this.winPercentage = {
            title: { text: 'Postotak pobjeda' },
            series: [{
                type: 'spline',
                color: '#ef6c00',
                data: [29.9, 50, 71.5, 65.2, 73.8],
            }]
        };

        this.eloRating = {
            title: { text: 'Elo rating' },
            shadow: true,
            series: [{
                type: 'areaspline',
                color: '#00b0ff',
                data: [1299.9, 1471.5, 1506.4, 1229.2, 1647.8],
            }]
        };

        this.gamesPerWeek = {
            chart: {
                type: 'column',
                styledMode: true
            },
            title: {
                text: 'Trenutna forma'
            },
            yAxis: {
                className: 'highcharts-color-0',
                title: {
                    text: 'Primary axis'
                }
            },
            plotOptions: {
                column: {
                    borderRadius: 5
                }
            },
            series: [{
                data: [4, 3, 1, 1, 4, 3],
            }]
        };

    }

}
