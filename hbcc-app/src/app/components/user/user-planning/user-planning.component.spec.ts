import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlanningComponent } from './user-planning.component';

describe('UserPlanningComponent', () => {
  let component: UserPlanningComponent;
  let fixture: ComponentFixture<UserPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
