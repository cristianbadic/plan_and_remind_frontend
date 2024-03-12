import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOverlapPopupComponent } from './check-overlap-popup.component';

describe('CheckOverlapPopupComponent', () => {
  let component: CheckOverlapPopupComponent;
  let fixture: ComponentFixture<CheckOverlapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckOverlapPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOverlapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
