import { Component, Input } from '@angular/core';
import { Player } from 'src/app/player/player.model';
import { Match } from 'src/app/player/matches/match.model';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    @Input() player: Player;
    @Input() matches: Array<Match>;

    position: Object;
    winPercentage: Object;
    eloRating: Object;
    resultsPie: Object;
    gamesPerWeek: Object;
    positionList: Array<number> = new Array<number>();
    eloRatingList: Array<number> = new Array<number>();
    winPercentageList: Array<number> = new Array<number>();

    constructor() {
    }

    ngOnInit(): void {

        this.player.archData.forEach(i => {
            this.positionList.push(i.position);
            this.eloRatingList.push(i.eloRating);
            this.winPercentageList.push(i.winPercentage);
        });

        this.resultsPieChart(this.player);
        this.positionChart(this.positionList);
        this.winPercentageChart(this.winPercentageList);
        this.eloRatingChart(this.eloRatingList);
        this.gamesPerWeekChart();
    }

    resultsPieChart(player: Player): void {
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
    }

    positionChart(positionList: Array<number>): void {
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
                data: positionList,
            }]
        };
    }

    winPercentageChart(winPercentageList: Array<number>): void {
        this.winPercentage = {
            title: { text: 'Postotak pobjeda' },
            series: [{
                type: 'spline',
                color: '#ef6c00',
                data: winPercentageList,
            }]
        };
    }

    eloRatingChart(eloRatingList: Array<number>): void {
        this.eloRating = {
            title: { text: 'Elo rating' },
            shadow: true,
            series: [{
                type: 'areaspline',
                color: '#00b0ff',
                data: eloRatingList,
            }]
        };
    }

    gamesPerWeekChart(): void {
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
