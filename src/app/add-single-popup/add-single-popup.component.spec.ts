import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSinglePopupComponent } from './add-single-popup.component';

describe('AddSinglePopupComponent', () => {
  let component: AddSinglePopupComponent;
  let fixture: ComponentFixture<AddSinglePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSinglePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSinglePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
