import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEpisodeModalComponent } from './new-episode-modal.component';

describe('NewEpisodeModalComponent', () => {
  let component: NewEpisodeModalComponent;
  let fixture: ComponentFixture<NewEpisodeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEpisodeModalComponent]
    });
    fixture = TestBed.createComponent(NewEpisodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
