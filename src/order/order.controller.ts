import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto){
    return this.orderService.createOrder(createOrderDto)
  }

  @Patch(":orderId/status")
  updateOrderStatus(@Body() updateOrderDto:UpdateOrderDto, @Param("orderId") orderId: string) {
    return this.orderService.updateOrderStatus(orderId, updateOrderDto.status);
  }

  @Get()
  getAllOrders(){
    return this.orderService.getAllOrders()
  }

  @Get(":userId")
  getOrderForOneUserNotActive(@Param("userId") userId: string){
    return this.orderService.getOrderForOneUserNotActive(userId)
  }

  @Get("/active/:userId")
  getOrderForOneUserActive(@Param("userId") userId: string){
    return this.orderService.getOrderForOneUserActive(userId)
  }
}
