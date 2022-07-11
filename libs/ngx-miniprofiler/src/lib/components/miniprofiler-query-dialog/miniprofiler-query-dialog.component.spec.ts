import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniprofilerQueryDialogComponent } from './miniprofiler-query-dialog.component';

describe('MiniprofilerQueryDialogComponent', () => {
  let component: MiniprofilerQueryDialogComponent;
  let fixture: ComponentFixture<MiniprofilerQueryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniprofilerQueryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniprofilerQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
