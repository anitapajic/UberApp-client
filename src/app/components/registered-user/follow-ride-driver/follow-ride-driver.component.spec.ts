import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowRideDriverComponent } from './follow-ride-driver.component';

describe('FollowRideDriverComponent', () => {
  let component: FollowRideDriverComponent;
  let fixture: ComponentFixture<FollowRideDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowRideDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowRideDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
