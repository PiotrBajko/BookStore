import { Injectable } from '@nestjs/common';
import { User } from './users.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateUserDto} from "./create-user.dto"
import { exception } from 'console';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private  userModel:Model<Document & User>)
    {}

    async getUsers(){
        const users = await this.userModel.find().exec();
        return users
    }

    async getUser(userID){
        const book = await this.userModel.findById(userID);
        if(!book){
           throw new exception('Cant find user');
        }
        return book as User;
    }

    async deleteUser(userID){
        const user = await (await this.userModel.findById(userID)).delete()
        return {status: "Successfuly deleted book."}
    }

    async findUser(username){
        const user = await this.userModel.findOne({username : username})
        return user as User;
    }
}
