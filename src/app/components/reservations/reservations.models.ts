export interface CreateReservationRequest {
  roomId: string
  startDate: string
  endDate: string
}

export interface ReservationResponse {
  id: string
  reservationCode: string
  username: string
  userEmail: string
  roomName: string
  hotelName: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  createdAt: string
  message: any
  checkIn: string | undefined
}
