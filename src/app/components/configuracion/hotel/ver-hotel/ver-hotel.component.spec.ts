import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHotelComponent } from './ver-hotel.component';

describe('VerHotelComponent', () => {
  let component: VerHotelComponent;
  let fixture: ComponentFixture<VerHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
