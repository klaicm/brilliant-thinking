import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { TableComponent } from './table/table.component';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TrophiesComponent } from './trophies/trophies.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'table', component: TableComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'trophies', component: TrophiesComponent }
]
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
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
