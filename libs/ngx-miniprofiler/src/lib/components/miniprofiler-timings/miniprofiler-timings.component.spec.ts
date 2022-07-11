import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniProfilerTimingsComponent } from './miniprofiler-timings.component';

describe('MiniProfilerTimingsComponent', () => {
  let component: MiniProfilerTimingsComponent;
  let fixture: ComponentFixture<MiniProfilerTimingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniProfilerTimingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniProfilerTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
