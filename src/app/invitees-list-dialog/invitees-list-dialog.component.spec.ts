import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteesListDialogComponent } from './invitees-list-dialog.component';

describe('InviteesListDialogComponent', () => {
  let component: InviteesListDialogComponent;
  let fixture: ComponentFixture<InviteesListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteesListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteesListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
