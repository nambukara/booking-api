import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  async create(createBookingDto: CreateBookingDto) {
    // Rule 1: A booking must belong to an existing service
    const service = await this.prisma.service.findUnique({
      where: { id: createBookingDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${createBookingDto.serviceId} not found`);
    }

    // Rule 2: Booking dates cannot be in the past
    const bookingDate = new Date(createBookingDto.bookingDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates without time
    const incomingDate = new Date(bookingDate);
    incomingDate.setHours(0, 0, 0, 0);

    if (incomingDate < now) {
      throw new BadRequestException('Booking dates cannot be in the past');
    }

    // Rule 3: Prevent duplicate bookings for same service and time
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        service_id: createBookingDto.serviceId,
        booking_date: new Date(createBookingDto.bookingDate),
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
    });

    const incomingTime = new Date(createBookingDto.bookingTime);
    const incomingHours = incomingTime.getHours();
    const incomingMinutes = incomingTime.getMinutes();

    const isDuplicate = existingBookings.some((b) => {
      const existingTime = new Date(b.booking_time);
      return existingTime.getHours() === incomingHours && existingTime.getMinutes() === incomingMinutes;
    });

    if (isDuplicate) {
      throw new BadRequestException('This time slot is already booked for the selected service');
    }

    return this.prisma.booking.create({
      data: {
        customer_name: createBookingDto.customerName,
        customer_email: createBookingDto.customerEmail,
        customer_phone: createBookingDto.customerPhone,
        service_id: createBookingDto.serviceId,
        booking_date: new Date(createBookingDto.bookingDate),
        booking_time: new Date(createBookingDto.bookingTime),
        notes: createBookingDto.notes,
      },
    });
  }


  async findAll() {
    return this.prisma.booking.findMany({ include: { service: true } });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true }
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: number, updateBookingStatusDto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    // Rule 3: Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && updateBookingStatusDto.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: updateBookingStatusDto.status as any },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}

