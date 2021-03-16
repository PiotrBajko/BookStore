import {OrderService} from './order.service'
import { Controller, Get , Param, Post, Delete, Query, Body, UseGuards, Request} from '@nestjs/common';
import {CreateOrderDto} from './create-order.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService){}

    @Get()
    async getOrders(){
        const orders = await this.orderService.getOrders();
        return orders;
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    async addOrder(@Request() req){
        const order = await this.orderService.addOrder(req.body.arrayOfBooks, req.user.userId )
          return order
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    async geyMyOrders(@Request() req){
        const order = await this.orderService.getMyOrders(req.user.userId )
          return order
    }

    @UseGuards(JwtAuthGuard)
    @Delete('cancel')
    async cancelOrder(@Request() req){
        const order = await this.orderService.cancelOrder(req.user.userId , req.body.orderID )
        return order
    }
}
