import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
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
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status: updateBookingStatusDto.status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}

