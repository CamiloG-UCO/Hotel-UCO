import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { CancelReservationComponent } from './cancel-reservation.component';
import { ReservationService } from '../../services/reservation/cancel-reservation/reservation.service';
import { of, throwError } from 'rxjs';

describe('CancelReservationComponent', () => {
  let component: CancelReservationComponent;
  let fixture: ComponentFixture<CancelReservationComponent>;
  let cancelReservationService: jasmine.SpyObj<ReservationService>;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(async () => {
    const cancelReservationServiceSpy = jasmine.createSpyObj('CancelReservationService', [
      'getBookingByRoom',
      'cancelBooking'
    ]);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get']);

    await TestBed.configureTestingModule({
      imports: [CancelReservationComponent, HttpClientTestingModule],
      providers: [
        { provide: ReservationService, useValue: cancelReservationServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CancelReservationComponent);
    component = fixture.componentInstance;
    cancelReservationService = TestBed.inject(ReservationService) as jasmine.SpyObj<ReservationService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for a booking by room code', () => {
    const mockBooking = {
      id: '123',
      client: { name: 'John Doe', email: 'john@example.com' },
      room: { roomCode: 'R-321', hotel: { name: 'BUG HOTEL' } },
      status: { name: 'Confirmed' },
      bookingDate: new Date()
    };

    component.roomCode = 'R-321';
    cancelReservationService.getBookingByRoom.and.returnValue(of(mockBooking));

    component.searchBooking();

    expect(cancelReservationService.getBookingByRoom).toHaveBeenCalledWith('R-321');
    expect(component.booking).toEqual(mockBooking);
  });

  it('should show error when room code is empty', () => {
    component.roomCode = '';

    component.searchBooking();

    expect(component.error).toBeTruthy();
    expect(component.error).toContain('Por favor ingresa');
  });

  it('should handle search error', () => {
    component.roomCode = 'R-999';
    cancelReservationService.getBookingByRoom.and.returnValue(
      throwError(() => new Error('Not found'))
    );

    component.searchBooking();

    expect(component.error).toBeTruthy();
    expect(component.booking).toBeNull();
  });

  it('should cancel a booking', () => {
    component.booking = {
      id: '123',
      client: { name: 'John Doe' },
      room: { roomCode: 'R-321' }
    };
    component.roomCode = 'R-321';

    cancelReservationService.cancelBooking.and.returnValue(of('Reserva eliminada con exito'));

    spyOn(window, 'confirm').and.returnValue(true);

    component.cancelBooking();

    expect(cancelReservationService.cancelBooking).toHaveBeenCalledWith('R-321');
    expect(component.success).toContain('Reserva eliminada');
  });

  it('should reset the form', () => {
    component.roomCode = 'R-321';
    component.booking = { id: '123' };
    component.error = 'Some error';

    component.resetForm();

    expect(component.roomCode).toBe('');
    expect(component.booking).toBeNull();
    expect(component.error).toBeNull();
  });
});
