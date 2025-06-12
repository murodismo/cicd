import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument, OrderStatus } from 'src/schema/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schema/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, product, stock = 1 } = createOrderDto;
  
    const foundedUserOrder = await this.orderModel.findOne({ userId, status: OrderStatus.NOT_ACTIVE });
    const foundedProduct = await this.productModel.findById(product);
  
    if (!foundedProduct) {
      throw new NotFoundException("Product not found");
    }
  
    if (foundedProduct.stock < stock) {
      throw new BadRequestException(`Not enough stock for product ${foundedProduct.title}. Available: ${foundedProduct.stock}`);
    }
  
    foundedProduct.stock -= stock;
    await foundedProduct.save();
  
    if (foundedUserOrder) {
      foundedUserOrder.products.push({
        product,
        stock
      });
      await foundedUserOrder.save();
      return { message: "Product added to existing order" };
    }
  
    await this.orderModel.create({
      userId,
      products: [{
        product,
        stock
      }],
      status: OrderStatus.NOT_ACTIVE,
    });
  
    return { message: "Order created successfully" };
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus) {    
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('order not found');
    }

    if (status === OrderStatus.COMPLETED) {
      await this.orderModel.findByIdAndDelete(orderId);
      return { message: 'Buyurtma muvaffaqiyatli tugatildi' };
    } else {
      order.status = status;
      return order.save();
    }
  }

  async getAllOrders() {
    return this.orderModel.find()
  }

  async getOrderForOneUserNotActive(userId: string) {
    const foundedOrders = await this.orderModel.findOne({ userId: userId, status: OrderStatus.NOT_ACTIVE }).populate("products")
    if (!foundedOrders) {
      return { message: "basket is empty" }
    }
    return foundedOrders
  }


  async getOrderForOneUserActive(userId: string) {
    const activeOrders = await this.orderModel.find({
      userId,
      status: { $ne: OrderStatus.NOT_ACTIVE },
    }).populate('products.product');

    if (activeOrders.length === 0) {
      return { message: "No active orders found" };
    }

    return activeOrders;
  }

}
