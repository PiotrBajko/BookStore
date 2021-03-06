import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookSchema} from './book.model'

import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name:'Book',schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService],
  exports:[BookService, MongooseModule.forFeature([{name: 'Book', schema: BookSchema}])]
})
export class BookModule {}
