import {Strategy} from 'passport-local'
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Body} from '@nestjs/common'
import {CreateValidationDto} from './create-validation.dto'


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(@Body() createValidationDto: CreateValidationDto) {
    const user = await this.authService.validateUser(createValidationDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}