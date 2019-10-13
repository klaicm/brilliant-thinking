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
    resultsPerMonth: Object;
    positionList: Array<number> = new Array<number>();
    eloRatingList: Array<number> = new Array<number>();
    winPercentageList: Array<number> = new Array<number>();
    winsPerMonth: Array<number> = new Array<number>();
    dataSource = new MatTableDataSource([]);
    displayedColumns: string[] = ['mark', 'opponent', 'result', 'date'];

    constructor(private cdref: ChangeDetectorRef, private router: Router) {
    }

    ngAfterViewInit(): void {

        this.player.archData.forEach(i => {
            this.positionList.push(i.position);
            this.eloRatingList.push(i.eloRating);
            this.winPercentageList.push(i.winPercentage);
            
            // ovdje sada malo više rada :)
            // početak i kraj mjeseca uzeti broj pobjeda i poraza iz arch tablice
            // nakon toga oduzeti početak od kraja i dobiti koliko je pobjeda, a koliko poraza u tom mjesecu
            // problem ostaje - kako izvući mjesece "univerzalizirati", a da ne bude hardkodiranje?
            // enumi, pa razdijeliti na zimsku i ljetnu ligu? 

        });

        this.resultsPieChart(this.player);
        this.positionChart(this.positionList);
        this.winPercentageChart(this.winPercentageList);
        this.eloRatingChart(this.eloRatingList);
        this.resultsPerMonthChart();

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
            credits: {
                enabled: false
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
                    y: (player.winsInTwo/(player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo))*100,                   sliced: true,
                    selected: true,
                    color: '#90ed7d'
                }, {
                    name: '2:1',
                    y: (player.winsInTb/(player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo))*100,
                    color: '#F4FF81'
                }, {
                    name: '1:2',
                    y: (player.losesInTb/(player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo))*100,
                    color: '#FFB74D'
                }, {
                    name: '0:2',
                    y: (player.losesInTwo/(player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo))*100,
                    color: '#FF5252'
                }]
            }]
        };
    }

    positionChart(positionList: Array<number>): void {
        this.position = {
            title: { text: 'Plasman kroz sezonu' },
            credits: {
                enabled: false
            },
            yAxis: {
                title: false,
                allowDecimals: false,
                reversed: true,
                showFirstLabel: true,
                showLastLabel: true
            },
            xAxis: {
                allowDecimals: false,
            },
            series: [{
                name: 'Plasman',
                type: 'spline',
                color: '#4527a0',
                data: positionList,
            }]
        };
    }

    winPercentageChart(winPercentageList: Array<number>): void {
        this.winPercentage = {
            title: { text: 'Postotak pobjeda' },
            credits: {
                enabled: false
            },
            yAxis: {
                title: false,
                allowDecimals: false,
                min: 0,
                max: 100
            },
            xAxis: {
                allowDecimals: false,
            },
            series: [{
                name: 'Postotak pobjeda',
                type: 'spline',
                color: '#ef6c00',
                data: winPercentageList,
            }]
        };
    }

    eloRatingChart(eloRatingList: Array<number>): void {
        this.eloRating = {
            title: { text: 'Elo rating' },
            credits: {
                enabled: false
            },
            yAxis: {
                title: false,
                allowDecimals: false,
                min: 750,
                tickInterval: 250
            },
            xAxis: {
                allowDecimals: false
            },
            shadow: true,
            series: [{
                name: 'ELO rating',
                type: 'areaspline',
                color: '#CCFF90',
                data: eloRatingList,
            }]
        };
    }

    resultsPerMonthChart(): void {
        this.resultsPerMonth = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Rezultati po mjesecima'
            },
            yAxis: {
                title: false
            },
            xAxis: {
                categories: ['1', '2', '3', '4', '5']
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Pobjede',
                data: [5, 3, 4, 7, 2],
                color: '#90ed7d'
            }, {
                name: 'Porazi',
                data: [2, 2, 1, 2, 1],
                color: '#FF5252'
            }]
        };
    }

    gaugeChart(): void {}

    navigateToPlayer(playerId: number): void {
        this.router.navigate(['/player', playerId]);
    }

}
