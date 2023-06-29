import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadoEstadoModalComponent } from './llamado-estado-modal.component';

describe('LlamadoEstadoModalComponent', () => {
  let component: LlamadoEstadoModalComponent;
  let fixture: ComponentFixture<LlamadoEstadoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LlamadoEstadoModalComponent]
    });
    fixture = TestBed.createComponent(LlamadoEstadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
