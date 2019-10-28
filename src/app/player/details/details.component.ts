import { Component, Input, OnChanges, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Player } from 'src/app/player/player.model';
import { Match } from 'src/app/player/matches/match.model';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() player: Player;
    @Input() matches: Array<Match>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

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
    currentPlayerPositionPts: number;
    currentPlayerPositionElo: number;
    allPlayers: Array<Player>;
    loadingPlayers: boolean;

    constructor(private cdref: ChangeDetectorRef, private router: Router, private playerService: PlayerService) { }

    ngOnInit(): void {
        this.getAllPlayers(this.player);
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
    }

    ngAfterViewInit(): void {

        this.positionList.push(this.currentPlayerPositionPts); // trenutna (live) pozicija

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
            setTimeout(() => {
                this.dataSource.paginator = this.paginator;
            });
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
            reflow: true,
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
                    y: (player.winsInTwo / (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo)) * 100, sliced: true,
                    selected: true,
                    color: '#B2FF59'
                }, {
                    name: '2:1',
                    y: (player.winsInTb / (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo)) * 100,
                    color: '#FFFF8D'
                }, {
                    name: '1:2',
                    y: (player.losesInTb / (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo)) * 100,
                    color: '#FFD180'
                }, {
                    name: '0:2',
                    y: (player.losesInTwo / (player.winsInTwo + player.winsInTb + player.losesInTb + player.losesInTwo)) * 100,
                    color: '#FFAB91'
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
            reflow: true,
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
                color: '#B39DDB',
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
            reflow: true,
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
                color: '#F48FB1',
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
            reflow: true,
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
            reflow: true,
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

    getAllPlayers(player: Player): void {
        setTimeout(() => {
            this.playerService.getAllPlayers().subscribe((response: Array<Player>) => {
                if (response) {
                    this.allPlayers = response;
                    this.loadingPlayers = false;

                    const pointsSortedList = this.allPlayers.sort((a, b) =>
                        (a.points > b.points) ? -1 : 1);

                    this.currentPlayerPositionPts = pointsSortedList.findIndex(playerEl => playerEl.id === player.id) + 1;
                    const eloSortedList = this.allPlayers.sort((a, b) =>
                        (a.elo > b.elo) ? -1 : 1);

                    this.currentPlayerPositionElo = eloSortedList.findIndex(playerEl => playerEl.id === player.id) + 1;
                } else {
                    console.error('Greška kod poziva servisa za dohvat grača. Details Component');
                }
            });
        }, 3000);
    }

    navigateToPlayer(playerId: number): void {
        this.router.navigate(['/player', playerId]);
    }

}
