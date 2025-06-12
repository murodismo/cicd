import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type OrderDocument = Order & Document;

export enum OrderStatus {
    NOT_ACTIVE = 'faollashmagan',
    PENDING = 'kutilyabdi',
    DELIVERING = 'yetkazib berilyabdi',
    ARRIVED = 'yetib keldi',
    COMPLETED = 'buyurtma topshirildi',
}

@Schema()
export class OrderProduct {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product: string; // yoki Product type ham bersa bo'ladi agar populate qilishni rejalashtirsangiz

  @Prop({ type: Number, default: 1 })
  stock: number;
}

const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ 
    type: [OrderProductSchema], 
    required: true 
  })
  products: OrderProduct[];

  @Prop({
    type: String, 
    enum: Object.values(OrderStatus), 
    default: OrderStatus.NOT_ACTIVE 
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);