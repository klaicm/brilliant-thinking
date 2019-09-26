import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.scss']
})
export class TrophiesComponent implements OnInit {

  tenWinsBadge: String = '../../../assets/images/10wins.PNG';
  constructor() { }

  // ova komponenta je pod-komponenta player-a
  // za nju ce se podaci vuci prema ID-u igraca, a kako brojiti stanja za svaki trofej?
  // npr. kako brojati niz pobjeda? (if result === 'W' ++, else 0?) itd.
  ngOnInit() {
  }

}
