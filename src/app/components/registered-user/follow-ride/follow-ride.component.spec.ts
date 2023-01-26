import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowRideComponent } from './follow-ride.component';

describe('FollowRideComponent', () => {
  let component: FollowRideComponent;
  let fixture: ComponentFixture<FollowRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
