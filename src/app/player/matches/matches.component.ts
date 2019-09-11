import { Component, OnInit, OnDestroy } from '@angular/core';
import { Player } from '../player.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlayerComponent } from 'src/app/player/player.component';
import { Input } from '@angular/core';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html'
})
export class MatchesComponent extends PlayerComponent implements OnInit, OnDestroy {

  @Input() matches: Array<any>;

}
