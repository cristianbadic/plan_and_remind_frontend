import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInvitationAddReminderComponent } from './accept-invitation-add-reminder.component';

describe('AcceptInvitationAddReminderComponent', () => {
  let component: AcceptInvitationAddReminderComponent;
  let fixture: ComponentFixture<AcceptInvitationAddReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptInvitationAddReminderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptInvitationAddReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
