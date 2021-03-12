import { Injectable, Body } from '@nestjs/common';
import {Order} from './order.model'
import * as mongoose from 'mongoose';
import {InjectModel} from '@nestjs/mongoose'
import {CreateOrderDto} from './create-order.dto'
import {BookService} from '../book/book.service'
import {Book} from '../book/book.model'
import {User} from '../users/users.model'
@Injectable()
export class OrderService {
    constructor(@InjectModel('Order') private  orderModel:mongoose.Model<mongoose.Document & Order>,@InjectModel('Book') public  bookModel:mongoose.Model<mongoose.Document & Book>, @InjectModel('User') private  userModel:mongoose.Model<mongoose.Document & User>)
    {        
    }
    
    async getOrders() {
        const orders = await this.orderModel.find().exec();
        return orders;
    }

    async addOrder(arrayOfBooks ,userID){
        var books  = []
        var realUserID = mongoose.Types.ObjectId(userID)
        var user = await this.userModel.findById(realUserID).exec()
        for(var i=0;i<arrayOfBooks.length;i++){
            var realBookID =  mongoose.Types.ObjectId(arrayOfBooks[i])
            var book = await this.bookModel.findById(realBookID).exec()
            books.push(book)
        }
        const newOrder = new this.orderModel()
        newOrder.books = books
        newOrder.user = user
        const result = await newOrder.save()
        return result

    }
}
