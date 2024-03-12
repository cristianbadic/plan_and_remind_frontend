import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInvitationOverlapComponent } from './accept-invitation-overlap.component';

describe('AcceptInvitationOverlapComponent', () => {
  let component: AcceptInvitationOverlapComponent;
  let fixture: ComponentFixture<AcceptInvitationOverlapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptInvitationOverlapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptInvitationOverlapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
