import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { TableComponent } from './table/table.component';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrophiesComponent } from 'src/app/player/trophies/trophies.component';
import { PlayerService } from 'src/app/player/player.service';
import { TableService } from 'src/app/table/table.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'table', component: TableComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'trophies', component: TrophiesComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    TableComponent,
    HomeComponent,
    TrophiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    PlayerService,
    TableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
