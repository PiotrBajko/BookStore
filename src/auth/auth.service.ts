import { Injectable, Body } from '@nestjs/common';
import {UsersService} from '../users/users.service'
import {CreateValidationDto} from './create-validation.dto'

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService){}

    async validateUser(@Body() createValidationDto: CreateValidationDto){
        const user = this.usersService.findUser(createValidationDto.username)
        if (user && (await user).password === createValidationDto.password){
            return user;
        }
        return null;
    }
}
