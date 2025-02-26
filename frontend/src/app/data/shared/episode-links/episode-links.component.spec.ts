import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeLinksComponent } from './episode-links.component';

describe('EpisodeLinksComponent', () => {
  let component: EpisodeLinksComponent;
  let fixture: ComponentFixture<EpisodeLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodeLinksComponent]
    });
    fixture = TestBed.createComponent(EpisodeLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
