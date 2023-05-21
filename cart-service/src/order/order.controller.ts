import { Controller, Get, Put, Body, Req, HttpStatus, Post } from "@nestjs/common";
import { QueryResult } from 'pg';
import { OrderService } from '../order';
import { AppRequest } from "../shared";
import { client } from '../db/db.client';

@Controller('api/profile/order')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) { }

  @Get()
  async findOrder(@Req() req: AppRequest) {
    try {
      let query = `select * from orders`;
      if (req.query.order_id) {
        query = `select * from orders where id='${req.query.order_id}'`;
      }
      console.log('query ', query);
      const order: QueryResult = await client(query);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
            orders: [...order.rows]
        }
      }
    } catch(e) {
      console.log('[findOrder] error happened during request', e)
    } 
  }


  @Post('checkout')
  async checkoutOrder(@Req() req: AppRequest, @Body() body) {
    try {
        const updateQuery = `update orders
            set 
            status='ORDERED'
            where id='${req.body.order_id}';`;
        console.log("updateQuery", updateQuery);
        const updatedOrder: QueryResult = await client(updateQuery);
        console.log('updatedOrder', updatedOrder);
        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: {
                order: updatedOrder.rows[0]
            }
        }
    } catch (e) {
        console.log('[checkoutOrder] error happened during request', e);
    }
  }
};
