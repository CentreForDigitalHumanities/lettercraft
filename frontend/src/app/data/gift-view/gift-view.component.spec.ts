import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftViewComponent } from './gift-view.component';

describe('GiftViewComponent', () => {
  let component: GiftViewComponent;
  let fixture: ComponentFixture<GiftViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftViewComponent]
    });
    fixture = TestBed.createComponent(GiftViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
