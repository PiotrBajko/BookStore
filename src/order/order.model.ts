import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {User, UserSchema} from "../users/users.model"
import {Book, BookSchema} from "../book/book.model"

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]})
  books: Book[];

  @Prop()
  isActive: Boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order)