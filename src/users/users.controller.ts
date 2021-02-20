import { Controller, Get , Param, Post, Delete, Query, Body} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get()
    async getUsers(){
        const users = await this.userService.getUsers();
        return users;
    }
    @Get(':userID')
    async getUser(@Param('userID') userID){
        const books = await this.userService.getUser(userID);
        return books;
    }
    @Delete(':userID')
    async deleteBook(@Param('userID') bookID){
        const user = await this.userService.deleteUser(bookID);
        return user;
    }
}
