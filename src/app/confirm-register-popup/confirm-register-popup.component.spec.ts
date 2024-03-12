import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegisterPopupComponent } from './confirm-register-popup.component';

describe('ConfirmRegisterPopupComponent', () => {
  let component: ConfirmRegisterPopupComponent;
  let fixture: ComponentFixture<ConfirmRegisterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRegisterPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmRegisterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
