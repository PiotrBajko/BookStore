import { HttpException, Injectable, Body} from '@nestjs/common';
import { resolve } from 'path';
import {Book} from './book.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateBookDto} from "./create-book.dto"
import { exception } from 'console';

@Injectable()
export class BookService {

    constructor(@InjectModel('Book') private  bookModel:Model<Document & Book>)
    {}
    

    async getBooks() {
        const books = await this.bookModel.find().exec();
        return books;
    }

    async getBook(bookID){
        const book = await this.bookModel.findById(bookID);
        if(!book){
           throw new exception('Cant find book');
        }
        return book as Book;
    }

    async addBook(@Body() createBookDto: CreateBookDto){
        const title = createBookDto.title
        const author = createBookDto.author
        const length = createBookDto.length
        const newBook = new this.bookModel({title,author,length});
        const result = await newBook.save();
        return result.id as string;
    }

    async deleteBook(bookID){
        const book = await (await this.bookModel.findById(bookID)).delete()
        return {status: "Successfuly deleted book."}
    }

}
