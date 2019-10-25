import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { OnInit } from '@angular/core';
import { Player } from 'src/app/player/player.model';
import { PlayerService } from 'src/app/player/player.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  logoi: String = '../assets/images/logoi.png';
  profilePic: String = '../assets/images/silhouette.png';
  title = 'app';
  allPlayers: Array<any> = new Array<any>();
  playerFormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  selectedPlayer: Player;

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from({ length: 50 }, () =>
    `Empty`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private playerService: PlayerService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.playerService.getAllPlayers().subscribe(response => {
      this.allPlayers = response;
    });

    this.filteredOptions = this.playerFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value)));
  }

  private _filter(value: any): any[] {
    const filterValue = value;
    return this.allPlayers.filter(option => option.firstName.toLowerCase().includes(filterValue));
  }

  displayFn(val: Player) {
    return val ? val.firstName + ' ' + val.lastName : val;
  }

  toPlayer() {
    this.selectedPlayer = this.playerFormControl.value;
    this.router.navigate(['/player', this.selectedPlayer.id]);
    this.playerFormControl.reset();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
