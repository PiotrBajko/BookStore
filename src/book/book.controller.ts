import { Controller, Get , Param, Post, Delete, Query, Body} from '@nestjs/common';
import { countReset } from 'console';
import {BookService} from './book.service'
import {CreateBookDto} from './create-book.dto'

@Controller('book')
export class BookController {
    constructor(private bookService: BookService){}

    @Get()
    async getBooks(){
        const books = await this.bookService.getBooks();
        return books;
    }

    @Get(':bookId')
    async getBook(@Param('bookId') bookID){
        const book = await this.bookService.getBook(bookID);
        return book;
    }

    @Post()
    async addBook(@Body() createBookDto: CreateBookDto){
        const bookID = await this.bookService.addBook(createBookDto)
        return {id:bookID };
    }

    @Delete(':bookId')
    async deleteBook(@Param('bookId') bookID){
        const book = await this.bookService.deleteBook(bookID);
        return book;
    }
}
