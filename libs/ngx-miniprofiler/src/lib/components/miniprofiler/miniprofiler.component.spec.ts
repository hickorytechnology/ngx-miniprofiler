import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniProfilerComponent } from './miniprofiler.component';

describe('MiniProfilerComponent', () => {
  let component: MiniProfilerComponent;
  let fixture: ComponentFixture<MiniProfilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniProfilerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniProfilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
