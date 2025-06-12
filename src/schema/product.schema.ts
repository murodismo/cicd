import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum CategoryEnum {
  Quloqchin = "quloqchin",
  Telefon = "telefon",
  SmartSoat = "smart soat",
  Kamera = "kamera",
  Kompyuter = "kompyuter",
  Gaming = "gaming"
}

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  color: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  brand: string;

  @Prop({ required: true, enum: CategoryEnum })
  category: CategoryEnum;

  @Prop()
  image: string;

  @Prop({default: 1})
  stock: number;

  @Prop({default: 0})
  rating: number;

  @Prop()
  memory: string;

  @Prop()
  screenType: string;

  @Prop()
  protection: string;

  @Prop()
  isFeatured: boolean;

  @Prop({
    type: [
      {
        userId: { type: String, required: true }, // yoki agar `ObjectId` bo'lsa: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        star: { type: Number, required: true, min: 1, max: 5 },
        username: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: {
    userId: string;
    star: number;
    username: string;
    text: string;
    createdAt: Date;
  }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
