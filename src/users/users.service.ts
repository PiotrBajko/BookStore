import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './users.model'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Document, Connection} from 'mongoose'
import {CreateUserDto} from "./create-user.dto"
import { exception } from 'console';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private  userModel:Model<Document & User>)
    {}

    async getUsers(){
        const users = await this.userModel.find().exec();
        return users
    }

    async getUser(userID){
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
        }
        const user = await this.userModel.findById(userID);
        if(!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user as User;
    }

    async deleteUser(userID){
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            throw new HttpException('Invalid objectID',HttpStatus.BAD_REQUEST)
        }
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
        throw new HttpException('Passwords doesnt match to each other', HttpStatus.BAD_REQUEST);

    }

    async findUser(username){
        const user = await this.userModel.findOne({username : username})
        if (!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user as User;
    }

    //in this function i dont check if userID is valid, if it isnt program will return 401 due to UseGuards
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
