import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Mahsulot nomi' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Mahsulot haqida qo\'shimcha ma\'lumot' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Mahsulot narxi' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Mahsulot rangi' })
  @IsString()
  color: string;

  @ApiPropertyOptional({ description: 'Mahsulot brendi' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Mahsulot kategoriyasi' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Mahsulot rasmi (URL manzili)' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: 'Omborda mavjud mahsulot soni' })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ description: 'Mahsulot reytingi' })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ description: 'Mahsulot xotirasi' })
  @IsOptional()
  @IsString()
  memory?: string;

  @ApiPropertyOptional({ description: 'Ekran turi' })
  @IsOptional()
  @IsString()
  screenType?: string;

  @ApiPropertyOptional({ description: 'Mahsulot himoyasi turi' })
  @IsOptional()
  @IsString()
  protection?: string;

  @ApiPropertyOptional({ description: 'Tanlangan mahsulotmi' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
