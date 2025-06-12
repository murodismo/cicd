import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: "Foydalanuvchining ID raqami",
    example: "662e8dcf1f1d7b001e5b7999",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Mahsulotning ID raqami",
    example: "662e8e741f1d7b001e5b799c",
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiPropertyOptional({
    description: "Buyurtma qilinayotgan mahsulot soni (default - 1)",
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;
}
