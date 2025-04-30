import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/schema/order.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    description: "Buyurtma statusi",
    enum: OrderStatus,
    example: OrderStatus.COMPLETED,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
