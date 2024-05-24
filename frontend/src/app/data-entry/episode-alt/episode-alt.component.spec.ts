import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeAltComponent } from './episode-alt.component';

describe('EpisodeAltComponent', () => {
  let component: EpisodeAltComponent;
  let fixture: ComponentFixture<EpisodeAltComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeAltComponent]
    });
    fixture = TestBed.createComponent(EpisodeAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
