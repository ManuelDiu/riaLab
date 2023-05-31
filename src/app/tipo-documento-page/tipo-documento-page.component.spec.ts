import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoPageComponent } from './tipo-documento-page.component';

describe('TipoDocumentoPageComponent', () => {
  let component: TipoDocumentoPageComponent;
  let fixture: ComponentFixture<TipoDocumentoPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoDocumentoPageComponent]
    });
    fixture = TestBed.createComponent(TipoDocumentoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
