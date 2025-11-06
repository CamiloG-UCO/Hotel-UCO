import { TestBed } from '@angular/core/testing';

import { UpdateclientService } from './updateclient.service';

describe('UpdateclientService', () => {
  let service: UpdateclientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateclientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
