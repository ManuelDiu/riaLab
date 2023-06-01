import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoIntegrantePageComponent } from './tipo-integrante-page.component';

describe('TipoIntegrantePageComponent', () => {
  let component: TipoIntegrantePageComponent;
  let fixture: ComponentFixture<TipoIntegrantePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoIntegrantePageComponent]
    });
    fixture = TestBed.createComponent(TipoIntegrantePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
