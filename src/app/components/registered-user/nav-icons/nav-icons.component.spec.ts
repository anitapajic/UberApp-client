import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavIconsComponent } from './nav-icons.component';

describe('NavIconsComponent', () => {
  let component: NavIconsComponent;
  let fixture: ComponentFixture<NavIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
