import { Component, Input } from '@angular/core';
import { PlayerComponent } from 'src/app/player/player.component';
import { Player } from 'src/app/player/player.model';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent {

    @Input() player: Player;
}
