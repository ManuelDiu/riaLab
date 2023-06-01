import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadosEPComponent } from './llamadosEP.component';

describe('llamadosEPComponent', () => {
  let component: LlamadosEPComponent;
  let fixture: ComponentFixture<LlamadosEPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlamadosEPComponent]
    });
    fixture = TestBed.createComponent(LlamadosEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
