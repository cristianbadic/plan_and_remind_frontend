import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAdditionalPopupComponent } from './invite-additional-popup.component';

describe('InviteAdditionalPopupComponent', () => {
  let component: InviteAdditionalPopupComponent;
  let fixture: ComponentFixture<InviteAdditionalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteAdditionalPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteAdditionalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
