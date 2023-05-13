
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {CartItem, Order} from '../models';
import {UserRepository} from '../repositories';
import {basicAuthorization} from '../services';
import {inject} from '@loopback/context';
import {CartItemService} from '../services/cart-item.service';
import {service} from '@loopback/core';
import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';

@authenticate('jwt')
export class CartItemController {
  constructor(
    @service(CartItemService) readonly cartItemService: CartItemService,
  ) {}

   /**
   * Create or update the orders for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @post("/carts/item")
  @response(200, {
    description: 'User shopping cart item created.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CartItem, {includeRelations: true}),
      },
    },
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async addItem (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CartItem, {
            title: 'NewCartItem',
            exclude: ['id'],
          }),
        },
      },
    }) item: CartItem
  ) {

  }
}
