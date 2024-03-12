import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationItemComponent } from '././invitation-item.component';

describe('EventItemComponent', () => {
  let component: InvitationItemComponent;
  let fixture: ComponentFixture<InvitationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
