import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviceDialogComponent } from './new-device-dialog.component';

describe('NewDeviceDialogComponent', () => {
  let component: NewDeviceDialogComponent;
  let fixture: ComponentFixture<NewDeviceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDeviceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
