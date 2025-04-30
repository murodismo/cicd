import { IsEnum } from "class-validator";
import { OrderStatus } from "src/schema/order.schema";

export class UpdateOrderDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
  }
  