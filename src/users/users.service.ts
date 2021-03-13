import { Injectable, Body } from '@nestjs/common';
import { User } from './users.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateUserDto} from "./create-user.dto"
import { exception } from 'console';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private  userModel:Model<Document & User>)
    {}

    async getUsers(){
        const users = await this.userModel.find().exec();
        return users
    }

    async getUser(userID){
        const user = await this.userModel.findById(userID);
        if(!user){
           throw new exception('Cant find user');
        }
        return user as User;
    }

    async deleteUser(userID){
        const user = await (await this.userModel.findById(userID)).delete()
        return {status: "Successfuly deleted user."}
    }

    async addUser(@Body() createUserDto: CreateUserDto){
        const username = createUserDto.username
        const password = createUserDto.password
        const password2 = createUserDto.password2
        const user = await this.userModel.findOne({username : username})
        if (user){
            return {status:" User already exists in database"}
        }
        const cash = 0
        
        if (password === password2){
            const newUser = new this.userModel({username, password,cash })
            return user as User;
        }
        return {status:"Passwords doesnt match "}

    }

    async findUser(username){
        const user = await this.userModel.findOne({username : username})
        return user as User;
    }

    async chargeUp(userID, amountOfCash){
        const user = await (await this.userModel.findById(userID))
        const cashUpdated = user.cash + amountOfCash
        const updatedUser = await this.userModel.findOneAndUpdate({userId:userID},{cash : cashUpdated})
        return cashUpdated;
    }
    
}
