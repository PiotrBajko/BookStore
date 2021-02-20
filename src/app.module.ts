import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BookModule , MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest',{useNewUrlParser: true}), UsersModule, AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
