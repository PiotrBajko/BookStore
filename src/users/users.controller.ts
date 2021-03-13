import { Controller, Get , Param, Post, Delete, Query, Body, Request, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { Console } from 'console';
import {CreateUserDto} from "./create-user.dto"
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    @Post()
    async addUser(@Body() createUserDto: CreateUserDto){
        const users = await this.userService.addUser(createUserDto);
        return users;
    }
    @UseGuards(JwtAuthGuard)
    @Post('charge')
    async chargeAccount(@Request() req){
        const user = await this.userService.chargeUp(req.user.userId , req.body.amount)
        return {amountOfCash: user}
    }
}
