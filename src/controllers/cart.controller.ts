import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Cart, CartItem} from '../models';
import {basicAuthorization, CartService} from '../services';

@authenticate('jwt')
export class CartController {
  constructor(
    @service(CartService) private readonly cartService: CartService,
    @inject(SecurityBindings.USER) private readonly currentUserProfile: UserProfile,
  ) { }

  @post('/carts')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart)
      }
    },
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            title: 'NewCart',
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    cart: Omit<Cart, 'id'>,
    @inject(SecurityBindings.USER) loggedInUserProfile: UserProfile,
  ): Promise<Cart> {
    return this.cartService.create(cart, loggedInUserProfile);
  }

  @get('/carts/count')
  @response(200, {
    description: 'Cart model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cart) where?: Where<Cart>,
  ): Promise<Count> {
    return this.cartService.count(where);
  }

  @get('/carts')
  @response(200, {
    description: 'Array of Cart model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cart, {includeRelations: true, }),
        },
      },
    },
  })
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async find(
    @param.filter(Cart) filter?: Filter<Cart>,
  ): Promise<Cart[]> {
    return this.cartService.find(filter);
  }

  // @patch('/carts')
  // @response(200, {
  //   description: 'Cart PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Cart, {partial: true}),
  //       },
  //     },
  //   })
  //   cart: Cart,
  //   @param.where(Cart) where?: Where<Cart>,
  // ): Promise<Count> {
  //   return this.cartRepository.updateAll(cart, where);
  // }

  @get('/carts/{id}')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {includeRelations: true}),
      },
    },
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cart, {exclude: 'where'}) filter?: FilterExcludingWhere<Cart>
  ): Promise<Cart> {
    return this.cartService.findById(id, filter);
  }

  @get('/carts/user')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart),
      },
    },
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async findByUserId(
    @inject(SecurityBindings.USER) loggedInUserProfile: UserProfile,
    @param.filter(Cart, {exclude: 'where'}) filter?: FilterExcludingWhere<Cart>
  ): Promise<Cart> {
    return this.cartService.findByUser(loggedInUserProfile);
  }

  @patch('/carts/{id}')
  @response(204, {
    description: 'Cart PATCH success',
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Cart,
  ): Promise<void> {
    await this.cartService.updateById(id, cart);
  }

  @put('/carts/{id}')
  @response(204, {
    description: 'Cart PUT success',
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cart: Cart,
  ): Promise<void> {
    await this.cartService.replaceById(id, cart);
  }

  @del('/carts/{id}')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  @response(204, {
    description: 'Cart DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cartService.deleteById(id);
  }

  @put("/carts/add-item")
  @response(200, {
    description: 'User shopping cart item added.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CartItem, {includeRelations: true}),
      },
    },
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async addItem(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CartItem, {
            title: 'NewCartItem',
            optional: ['quantity'],
            exclude: ['product']
          }),
        },
      },
    }) item: CartItem,
    @inject(SecurityBindings.USER) loggedInUserProfile: UserProfile,
  ) {
    return this.cartService.addItem(item, loggedInUserProfile);
  }

  @del("/carts/remove-item/{itemId}")
  @response(200, {
    description: 'User shopping cart item removed.'
  })
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async removeItem (
    @param.path.string('itemId') itemId: string,
    @inject(SecurityBindings.USER) loggedInUserProfile: UserProfile,
  ) {
    return this.cartService.removeItem(itemId, loggedInUserProfile);
  }
}


