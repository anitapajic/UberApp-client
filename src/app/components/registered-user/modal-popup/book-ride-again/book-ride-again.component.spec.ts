import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRideAgainComponent } from './book-ride-again.component';

describe('BookRideAgainComponent', () => {
  let component: BookRideAgainComponent;
  let fixture: ComponentFixture<BookRideAgainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookRideAgainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookRideAgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
