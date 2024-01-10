import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAthleteModalComponent } from './add-athlete-modal.component';

describe('AddAthleteModalComponent', () => {
  let component: AddAthleteModalComponent;
  let fixture: ComponentFixture<AddAthleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAthleteModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAthleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
