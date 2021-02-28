import { Controller, Get, Post, Request} from '@nestjs/common';
import { Console } from 'console';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }
}
