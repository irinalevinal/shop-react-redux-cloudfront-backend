import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { QueryResult } from 'pg';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { client } from '../db/db.client';

const {
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_HOST,
} = process.env;

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  //?cartid=2a9aeaec-a688-4199-8afc-174f64304292
  @Get()
  async findAllCarts(@Req() req: AppRequest) {
    try {
      let query = 'select * from carts;';
      const carts: QueryResult = await client(query);

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          carts: carts.rows,
          count: carts.rowCount
        },
      };
      // }
    } catch (e) {
      console.log('[findAllCarts] error happened during request', e);
      return {
        myError: e,
      };
    }
  }

  @Get("item")
  async findCartItemById(@Req() req: AppRequest) {
    try {

      const query = `select * from carts where id = '${req.query.cart_id}';`;
      const cart: QueryResult = await client(query);
      
      if (cart) {
        const items = await client(
          `select * from cart_items where cart_id = '${cart.rows[0].id}';`,
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'OK',
          data: {
            cartItem: { ...cart.rows[0], items: items.rows[0] || [] },
          },
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cartItem: {},
        },
      };
      // }
    } catch (e) {
      console.log('[findCartItemById] error happened during request ', e);
      return {
        myError: e,
      };
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    try {
      const cartItems = await client(
        `select * from cart_items where cart_id = '${body.cart_id}';`,
      );
      let result;
      let updatedCartItems = [];
      if (cartItems && cartItems.rowCount > 0) {
        result = await client(
          `update cart_items set items = '${JSON.stringify([
            {
              ...body.product,
              count: body.count,
            },
          ])}' where cart_id = '${body.cartId}'`,
        );
      } else {
        result = await client(
          `insert into cart_items (items, cart_id) values ('${JSON.stringify([
            {
              ...body.product,
              count: body.count,
            },
          ])}', '${body.cartId}');`,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          message: `Success on  ${body.cartId} cart update. ${result}`,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `[updateUserCart] error with put for ${body.product.id}`,
        e,
      };
    }
  }
  
}

