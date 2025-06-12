import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Foydalanuvchi nomi',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email manzili',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'mySecret123',
    description: 'Foydalanuvchi paroli',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: 123456,
    description: 'Email orqali yuborilgan tasdiqlash kodi (majburiy emas)',
  })
  @IsOptional()
  @IsNumber()
  verification_code?: number;
}
