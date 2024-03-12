import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberConfirmatiomPopupComponent } from './phone-number-confirmatiom-popup.component';

describe('PhoneNumberConfirmatiomPopupComponent', () => {
  let component: PhoneNumberConfirmatiomPopupComponent;
  let fixture: ComponentFixture<PhoneNumberConfirmatiomPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneNumberConfirmatiomPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberConfirmatiomPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
