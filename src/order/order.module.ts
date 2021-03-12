import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {OrderSchema} from './order.model'
import {MongooseModule} from '@nestjs/mongoose';
import { BookSchema} from '../book/book.model'
import {UserSchema} from '../users/users.model'

@Module({
  imports: [MongooseModule.forFeature([{name:'Order',schema: OrderSchema }]), MongooseModule.forFeature([{name: 'Book', schema: BookSchema}]), MongooseModule.forFeature([{name:'User',schema: UserSchema }])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
