import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking } from '@prisma/client';

@Injectable()
export class BookingsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return this.prisma.booking.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
    include?: Prisma.BookingInclude;
  }): Promise<Booking[]> {
    return this.prisma.booking.findMany(params);
  }

  async count(params: { where?: Prisma.BookingWhereInput }): Promise<number> {
    return this.prisma.booking.count(params);
  }

  async findUnique(params: {
    where: Prisma.BookingWhereUniqueInput;
    include?: Prisma.BookingInclude;
  }): Promise<Booking | null> {
    return this.prisma.booking.findUnique(params);
  }

  async findFirst(params: {
    where?: Prisma.BookingWhereInput;
  }): Promise<Booking | null> {
    return this.prisma.booking.findFirst(params);
  }

  async update(params: {
    where: Prisma.BookingWhereUniqueInput;
    data: Prisma.BookingUpdateInput;
  }): Promise<Booking> {
    return this.prisma.booking.update(params);
  }

  async delete(params: {
    where: Prisma.BookingWhereUniqueInput;
  }): Promise<Booking> {
    return this.prisma.booking.delete(params);
  }
}
