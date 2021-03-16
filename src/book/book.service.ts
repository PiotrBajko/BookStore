import { HttpException, Injectable, Body, HttpStatus} from '@nestjs/common';
import { resolve } from 'path';
import {Book} from './book.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateBookDto} from "./create-book.dto"
import { exception } from 'console';
import * as mongoose from 'mongoose';

@Injectable()
export class BookService {

    constructor(@InjectModel('Book') public  bookModel:Model<Document & Book>)
    {}
    

    async getBooks() {
        const books = await this.bookModel.find().exec();
        return books;
    }

    async getBook(bookID){
        if (!mongoose.Types.ObjectId.isValid(bookID)) {
            throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
        }
        const book = await this.bookModel.findById(bookID);
        if(!book){
           throw new HttpException('Cant find book',HttpStatus.NOT_FOUND);
        }
        return book;
    }

    async addBook(@Body() createBookDto: CreateBookDto){
        const title = createBookDto.title
        const author = createBookDto.author
        const length = createBookDto.length
        const price = createBookDto.price;
        if(await this.bookModel.findOne({title:title , author:author})){
            throw new HttpException('Book with this author and title already exist in database',HttpStatus.FORBIDDEN)
        }
        const newBook = new this.bookModel({title,author,length,price});
        const result = await newBook.save();
        return result.id as string;
    }

    async deleteBook(bookID){
        if (!mongoose.Types.ObjectId.isValid(bookID)) {
            throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
        }
        if(!this.bookModel.findById(bookID).exec()){
            throw new HttpException('Can find book in database',HttpStatus.NOT_FOUND)
        }
        const book = await (await this.bookModel.findById(bookID)).delete()
        return {status: "Successfuly deleted book."}
    }

}
