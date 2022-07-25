import { User } from "./user";

export type Booking = {
  id: string;
  startTime: Date;
  bookingStatus: string;
  bookingType: string;
  description: string;
  createdAt: Date;
  attendees: User[];
  hostUser?: User;
  minutes?: number;
  location?: string;
  invoiceId?: string;
  nextBookingId?: string;
  repeat?: boolean;
};

// TODO use the below three booking types instead
export type Bookings = {
  id: string;
  customer: User;
  time_slot_id: string;
  invoice_id?: string;
  service_id?: string;
  booking_status?: string;
  party_size?: number;
  created_at: string;
  updated_at: string;
};

export type TimeSlot = {
  id: string;
  start_time: string;
  availability_count?: number;
  booking_count?: number;
  is_bookable?: boolean;
  maximum_party_size?: number;
  service_id?: string;
  created_at?: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  duration: number;
  locations?: string[];
  time_slots?: TimeSlot[];
  created_at: string;
  updated_at: string;
};

export type BookingNew = {
  id: string;
  startTime: string;
  bookingStatus: string;
  bookingType: string;
  description: string;
  createdAt?: string;
  attendees: User[];
  hostUser?: User;
  minutes?: number;
  location?: string;
  invoiceId?: string;
  nextBookingId?: string;
  repeat?: boolean;
};

export type BookingCreate = {
  startTime: string;
  bookingStatus: string;
  bookingType: string;
  description: string;
  attendees: User[];
};
// {
//   "startTime": "2022-07-30 13:30",
//   "bookingType": "ONLINE",
//   "bookingStatus": "SCHEDULED",
//   "description": "1hr session with Craig",
//   "attendees": [
//       {
//           "contactEmail": "gbagnall8@gmail.com"
//       }
//   ]
// }

// {
//   "id": "8f2be065-5ff8-4b49-b415-8ef957fe4b81",
//   "startTime": "2022-07-30T13:30:00.000Z",
//   "bookingType": "ONLINE",
//   "description": "1hr session with Craig",
//   "createdAt": "2022-07-17T07:25:42.240Z",
//   "attendees": [
//       {
//           "contactEmail": "gbagnall8@gmail.com"
//       }
//   ]
// }

export class BookingClass implements Booking {
  id: string;
  startTime: Date;
  bookingStatus: string;
  bookingType: string;
  description: string;
  createdAt: Date;
  attendees: User[];
  hostUser?: User;
  minutes?: number;
  location?: string;
  invoiceId?: string;
  nextBookingId?: string;
  repeat?: boolean;

  constructor({
    id: _id,
    startTime: _startTime,
    bookingStatus: _bookingStatus,
    bookingType: _bookingType,
    description: _description,
    createdAt: _createdAt,
    attendees: _attendees,
    hostUser: _hostUser,
    minutes: _minutes,
    location: _location,
    invoiceId: _invoiceId,
    nextBookingId: _nextBookingId,
    repeat: _repeat,
  }: BookingNew) {
    this.id = _id;
    this.startTime = new Date(_startTime);
    this.bookingStatus = _bookingStatus;
    this.bookingType = _bookingType;
    this.description = _description;
    this.createdAt = _createdAt ? new Date(_createdAt) : new Date();
    this.attendees = _attendees;
    this.minutes = _minutes;
    this.hostUser = _hostUser;
    this.location = _location;
    this.invoiceId = _invoiceId;
    this.nextBookingId = _nextBookingId;
    this.repeat = _repeat;
  }

  to_new(): BookingNew {
    return {
      ...this,
      startTime: this.startTime.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }
}
