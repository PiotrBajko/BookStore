import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './users.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateUserDto} from "./create-user.dto"
import { exception } from 'console';
import * as bcrypt from 'bcrypt';

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
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user as User;
    }

    async deleteUser(userID){
        const user = await (await this.userModel.findById(userID))
        if(user){
            const result =  await (await this.userModel.findById(userID)).delete()
            return {status: "Successfuly deleted user."}
        }
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async addUser(@Body() createUserDto: CreateUserDto){
        const username = createUserDto.username
        const user = await this.userModel.findOne({username : username})
        if (user){
            throw new HttpException('User already exist in database', HttpStatus.FORBIDDEN);
        }
        if (createUserDto.password === createUserDto.password2){
            const soltOrRounds = 10 // default value from documentation
            const password = await bcrypt.hash(createUserDto.password,soltOrRounds)
            const newUser = new this.userModel({username, password,cash:0 })
            const result = await newUser.save()
            return result;
        }
        throw new HttpException('User already exist in database', HttpStatus.FORBIDDEN);

    }

    async findUser(username){
        const user = await this.userModel.findOne({username : username})
        if (!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user as User;
    }

    async chargeUp(userID, amountOfCash){
        const user = await (await this.userModel.findById(userID))
        if(amountOfCash < 0){
            throw new HttpException('You cant take away your cash', HttpStatus.FORBIDDEN);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(userID,{cash : Number(user.cash) + Number(amountOfCash)} , {
            returnOriginal: true
          })
        return updatedUser.cash;
    }
    
}
