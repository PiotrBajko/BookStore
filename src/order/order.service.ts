import { Injectable, Body } from '@nestjs/common';
import {Order} from './order.model'
import * as mongoose from 'mongoose';
import {InjectModel} from '@nestjs/mongoose'
import {CreateOrderDto} from './create-order.dto'
import {BookService} from '../book/book.service'
import {Book} from '../book/book.model'
import {User} from '../users/users.model'
import { exception } from 'console';
@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private  orderModel:mongoose.Model<mongoose.Document & Order>,@InjectModel('Book') public  bookModel:mongoose.Model<mongoose.Document & Book>, @InjectModel('User') private  userModel:mongoose.Model<mongoose.Document & User>)
    {        
    }
    
    async getOrders() {
        const orders = await this.orderModel.find().exec();
        return orders;
    }

    async getMyOrders(userID){
        const user = await this.userModel.findById(userID).exec()
        const orders = await this.orderModel.find({user:user}).exec()
        return orders;

    }

    async addOrder(arrayOfBooks ,userID){
        var books  = []
        var user = await this.userModel.findById(userID).exec()
        var priceForAllBooks = 0
        for(var i=0;i<arrayOfBooks.length;i++){
            var realBookID =  mongoose.Types.ObjectId(arrayOfBooks[i])
            var book = await this.bookModel.findById(realBookID).exec()
            if (!book)
            {
            priceForAllBooks = Number(book.price) + priceForAllBooks
            books.push(book)
            }
            else{
                throw new exception("Book doesnt exist in database")
            }
        }
        if(user.cash < priceForAllBooks){
            throw new exception("Not enought cash for order")
        }
        else{
            user = await this.userModel.findOneAndUpdate({userId:userID},{cash : Number(user.cash) - priceForAllBooks})
        }
        const newOrder = new this.orderModel()
        newOrder.books = books
        newOrder.user = user
        const result = await newOrder.save()
        return result

    }
}
