import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EloStatsComponent } from './elo-stats.component';

describe('EloStatsComponent', () => {
  let component: EloStatsComponent;
  let fixture: ComponentFixture<EloStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EloStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EloStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
