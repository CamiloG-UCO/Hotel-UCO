import { TestBed } from '@angular/core/testing';
import { hotelService } from './hotel.service';

describe('HotelService', () => {
  let service: hotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(hotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
