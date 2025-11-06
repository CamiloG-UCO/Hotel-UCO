import { TestBed } from '@angular/core/testing';

import { ConsultarEmpleadosService } from './consultar-empleados.service';

describe('ConsultarEmpleadosService', () => {
  let service: ConsultarEmpleadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultarEmpleadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
