import { Injectable , Body} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {CreateValidationDto} from './create-validation.dto'
import { Console, exception } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(@Body() createValidationDto: CreateValidationDto){
    const user = await this.usersService.findUser(createValidationDto.username)
    if (user &&  user.password === createValidationDto.password){
        return user;
    }
    return null;
}

  async login(@Body() createValidationDto: CreateValidationDto) {
    const user = await this.validateUser(createValidationDto)
    if(!user){
      return  {
        error: "Wrong username or password"
      }
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}