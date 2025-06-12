import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Orders') // Swagger grouping
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order or add product to existing order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created or updated successfully' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }rm -rf node_modules
rm package-lock.json
npm install


  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status (e.g. complete or cancel)' })
  @ApiParam({ name: 'orderId', required: true, description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order status updated or deleted if completed' })
  updateOrderStatus(@Body() updateOrderDto: UpdateOrderDto, @Param('orderId') orderId: string) {
    return this.orderService.updateOrderStatus(orderId, updateOrderDto.status);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Returns all orders' })
  getAllOrders() {
    return this.orderService.getAllOrders();
  }
  

  @Get(':userId')
  @ApiOperation({ summary: 'Get NOT_ACTIVE order (basket) for one user' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns user basket or message if empty' })
  getOrderForOneUserNotActive(@Param('userId') userId: string) {
    return this.orderService.getOrderForOneUserNotActive(userId);
  }

  @Get('/active/:userId')
  @ApiOperation({ summary: 'Get active (not NOT_ACTIVE) orders for one user' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns active orders or message if none found' })
  getOrderForOneUserActive(@Param('userId') userId: string) {
    return this.orderService.getOrderForOneUserActive(userId);
  }
}
