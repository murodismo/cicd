import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop({required: true})
  userId: string;

  @Prop({ 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
    default: [] 
  })
  likedProducts: mongoose.Types.ObjectId[]
}

export const LikeSchema = SchemaFactory.createForClass(Like);