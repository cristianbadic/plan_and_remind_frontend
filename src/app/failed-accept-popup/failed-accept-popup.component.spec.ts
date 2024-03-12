import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedAcceptPopupComponent } from './failed-accept-popup.component';

describe('FailedAcceptPopupComponent', () => {
  let component: FailedAcceptPopupComponent;
  let fixture: ComponentFixture<FailedAcceptPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedAcceptPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailedAcceptPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
