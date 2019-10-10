import { Component, Input, OnChanges } from '@angular/core';
import { Player } from 'src/app/player/player.model';
import { Match } from 'src/app/player/matches/match.model';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements AfterViewInit, OnChanges {

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
    dataSource = new MatTableDataSource([]);
    displayedColumns: string[] = ['mark', 'opponent', 'result', 'date'];

    constructor(private cdref: ChangeDetectorRef, private router: Router) {
    }

    ngAfterViewInit(): void {

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

        this.cdref.detectChanges();
    }

    ngOnChanges() {
        if (this.matches) {
            this.dataSource = new MatTableDataSource(this.matches);
        }
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
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        distance: -50
                    }
                }
            },
            series: [{
                name: 'Ishod',
                colorByPoint: true,
                data: [{
                    name: '2:0',
                    y: 55,
                    sliced: true,
                    selected: true
                }, {
                    name: '2:1',
                    y: 25,
                }, {
                    name: '0:2',
                    y: 10,
                }, {
                    name: '1:2',
                    y: 10,
                }]
            }]
        };
    }

    positionChart(positionList: Array<number>): void {
        this.position = {
            title: { text: 'Plasman kroz sezonu' },
            yAxis: {
                allowDecimals: false,
                reversed: true,
                showFirstLabel: true,
                showLastLabel: true
            },
            xAxis: {
                allowDecimals: false,
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
            yAxis: {
                allowDecimals: false,
                min: 0,
                max: 100
            },
            xAxis: {
                allowDecimals: false,
            },
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
            yAxis: {
                allowDecimals: false,
                min: 750,
                tickInterval: 250
            },
            xAxis: {
                allowDecimals: false
            },
            shadow: true,
            series: [{
                type: 'areaspline',
                color: '#CCFF90',
                data: eloRatingList,
            }]
        };
    }

    gamesPerWeekChart(): void {
        this.gamesPerWeek = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Prijedlog za graf'
            },
            xAxis: {
                categories: ['1', '2', '3', '4', '5']
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Luka',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Ivan',
                data: [2, -2, -3, 2, 1]
            }, {
                name: 'Marko',
                data: [3, 4, 4, -2, 5]
            }]
        };
    }

    gaugeChart(): void {}

    navigateToPlayer(playerId: number): void {
        this.router.navigate(['/player', playerId]);
    }

}
