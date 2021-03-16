import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
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
//in this function i dont check if userID is valid, if it isnt program will return 401 due to UseGuards
    async getMyOrders(userID){
        const user = await this.userModel.findById(userID).exec()
        const orders = await this.orderModel.find({user:user}).exec()
        if(!orders){
            throw new HttpException('You dont have any orders', HttpStatus.NOT_FOUND);
        }
        return orders;
    }
//in this function i dont check if userID is valid, if it isnt program will return 401 due to UseGuards
    async addOrder(arrayOfBooks ,userID){
        var books  = []
        var user = await this.userModel.findById(userID).exec()
        var priceForAllBooks = 0
        for(var i=0;i<arrayOfBooks.length;i++){
            if (!mongoose.Types.ObjectId.isValid(arrayOfBooks[i])) {
                throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
            }
            var book = await this.bookModel.findById(arrayOfBooks[i]).exec()
            if (book)
            {
            priceForAllBooks = Number(book.price) + priceForAllBooks
            books.push(book)
            }
            else{
                throw new HttpException('One of the books wasnt found', HttpStatus.NOT_FOUND);
            }
        }
        if(user.cash < priceForAllBooks){
            throw new HttpException('Not enought cash', HttpStatus.NOT_FOUND);
        }
        else{
            user = await this.userModel.findByIdAndUpdate(userID,{cash : Number(user.cash) - priceForAllBooks} ,  {
                returnOriginal: true
              })
        }
        const newOrder = new this.orderModel()
        newOrder.books = books
        newOrder.user = user
        const result = await newOrder.save()
        return result

    }
    //in this function i dont check if userID is valid, if it isnt program will return 401 due to UseGuards
    //delete order and take back 80% of cash
    async cancelOrder(userID,orderID){
        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
        }
        var user = await this.userModel.findById(userID).exec()
        var order = await this.orderModel.findById(orderID).exec()
        if(!order){
            throw new HttpException('Order doesnt exist', HttpStatus.NOT_FOUND);
        }
        if (String(userID) != String(order.user)){
            throw new HttpException('Its not your order', HttpStatus.FORBIDDEN);
        }
        var cashBack  = 0
        for( var i =0; i<order.books.length;i++){
            var book = await this.bookModel.findById(order.books[i]).exec()
            cashBack = cashBack + Number(book.price)
        }
        cashBack = cashBack * 0.8

        user = await this.userModel.findByIdAndUpdate(userID,{cash : Number(user.cash) + cashBack} ,  {
            returnOriginal: true
          })
        const result = await (await this.orderModel.findById(orderID)).delete()
        return {status : "Successfully deleted order. U got " + cashBack + " cashback"}
    }
}
