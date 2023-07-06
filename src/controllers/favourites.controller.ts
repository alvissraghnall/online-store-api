import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Product, User} from '../models';
import {UserRepository} from '../repositories';
import {inject, service} from '@loopback/core';
import {FavouritesService} from '../services';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class FavouritesController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(FavouritesService) private favouritesService: FavouritesService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
  ) {}

  @post('/favourites')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async add(
    @requestBody({
      description: 'The id of product to be added.',
      required: true,
      content: {
        'application/json': {schema: {
          type: 'object',
          required: ['productId'],
          properties: {
            productId: {
              type: 'string',

            }
          },
        }},
      },
    })
    product: {productId: string},
  ) {
    return this.favouritesService.add(product.productId, this.loggedInUserProfile);
  }



  @get('/favourites')
  @response(200, {
    description: 'Array of User favourites',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<any> {
    return (await this.userRepository.findById(this.loggedInUserProfile[securityId], {
      include: ['favourites']
    })).favourites;
  }

  // @get('/favourites/{id}')
  // @response(200, {
  //   description: 'User favourite instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Product),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  // ): Promise<User> {
  //   return this.userRepository.findById(id, filter);
  // }

  @del('/favourites/{productId}')
  @response(204, {
    description: 'User Favourite item DELETE success',
  })
  async deleteById(@param.path.string('productId') productId: string): Promise<void> {
    await this.favouritesService.delete(productId, this.loggedInUserProfile);
  }
}
