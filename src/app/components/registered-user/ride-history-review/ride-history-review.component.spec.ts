import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideHistoryReviewComponent } from './ride-history-review.component';

describe('RideHistoryReviewComponent', () => {
  let component: RideHistoryReviewComponent;
  let fixture: ComponentFixture<RideHistoryReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideHistoryReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideHistoryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
