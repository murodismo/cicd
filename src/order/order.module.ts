import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schema/order.schema';
import { ProductModule } from 'src/product/product.module';
import { Product, ProductSchema } from 'src/schema/product.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [
    OrderController
  ],
  providers: [OrderService],
})
export class OrderModule {}
