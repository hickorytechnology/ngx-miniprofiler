import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniProfilerResultComponent } from './miniprofiler-result.component';

describe('MiniProfilerResultComponent', () => {
  let component: MiniProfilerResultComponent;
  let fixture: ComponentFixture<MiniProfilerResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiniProfilerResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniProfilerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
