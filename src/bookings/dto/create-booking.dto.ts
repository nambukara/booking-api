import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsInt()
  serviceId: number;

  @IsDateString()
  bookingDate: string;

  @IsDateString()
  bookingTime: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
