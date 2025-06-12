import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const userRoles = ["user", "admin", "superadmin"] as const;
type UserRole = typeof userRoles[number];

export type authDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({type: String, required: true, unique: true})
  username: string;

  @Prop({type: String, required: true, unique: true})
  email: string;

  @Prop({type: String, required: true})
  password: string;

  @Prop({ default: false })
  is_verify: boolean;

  @Prop({ type: Number, default: null })
  verification_code: number | null;

  @Prop({ type: String, enum: userRoles, default: "user" })
  role: UserRole;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
