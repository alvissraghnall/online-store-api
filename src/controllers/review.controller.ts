import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  RequestBodyObject,
  SchemaObject,
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
import {Review} from '../models';
import {ReviewRepository} from '../repositories';
import {ReviewService, basicAuthorization} from '../services';


const ReviewSchema: SchemaObject = {
  type: 'object',
  required: ['title', 'description', 'rating', 'productId'],
  properties: {
    title: {
      type: 'string',
      minLength: 4
    },
    description: {
      type: 'string',
      minLength: 8,
    },
    rating: {
      type: 'number',
    },
    productId: {
      type: 'string'
    }
  },
};

export const ReviewRequestBody: RequestBodyObject = {
  description: 'The input of reviewCreate function',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(Review, {
        exclude: ['id', 'userId']
      }),
    },
  },
  additionalProperties: false,

};


@authenticate('jwt')
export class ReviewController {
  constructor(
    @repository(ReviewRepository)
    public reviewRepository: ReviewRepository,
    @service(ReviewService) private readonly reviewService: ReviewService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
  ) { }

  @post('/reviews')
  @response(200, {
    description: 'Review model instance',
    content: {'application/json': {schema: getModelSchemaRef(Review)}},
  })
  async create(
    @requestBody(ReviewRequestBody)
    review: Omit<Review, 'id'>,
  ): Promise<Review> {
    return this.reviewService.create(review, this.loggedInUserProfile);
  }

  @get('/reviews/count')
  @response(200, {
    description: 'Review model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Review) where?: Where<Review>,
  ): Promise<Count> {
    return this.reviewService.count(where);
  }

  @get('/reviews/user')
  @response(200, {
    description: 'Review model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async getReviewsByUser(): Promise<Review[]> {
    return this.reviewService.findByUser(this.loggedInUserProfile);
  }

  // @get('/reviews/product/{productId}')
  // @response(200, {
  //   description: 'Review model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async getReviewsByProduct(): Promise<Review[]> {
  //   return this.reviewService.findByUser(this.loggedInUserProfile);
  // }

  @get('/reviews')
  @response(200, {
    description: 'Array of Review model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Review, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Review) filter?: Filter<Review>,
  ): Promise<Review[]> {
    return this.reviewService.find(filter);
  }

  @patch('/reviews')
  @response(200, {
    description: 'Review PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {partial: true}),
        },
      },
    })
    review: Review,
    @param.where(Review) where?: Where<Review>,
  ): Promise<Count> {
    return this.reviewService.updateAll(review, where);
  }

  @get('/reviews/{id}')
  @response(200, {
    description: 'Review model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Review, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Review, {exclude: 'where'}) filter?: FilterExcludingWhere<Review>
  ): Promise<Review> {
    return this.reviewService.findById(id, filter);
  }

  @patch('/reviews/{id}')
  @response(204, {
    description: 'Review PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Review, {partial: true}),
        },
      },
    })
    review: Review,
  ): Promise<void> {
    await this.reviewService.updateById(id, review);
  }

  @put('/reviews/{id}')
  @response(204, {
    description: 'Review PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() review: Review,
  ): Promise<void> {
    await this.reviewService.replaceById(id, review);
  }

  @del('/reviews/{id}')
  @response(204, {
    description: 'Review DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.reviewService.deleteById(id);
  }

  @del('/reviews')
  @response(204, {
    description: 'Reviews DELETE success',
  })
  @authorize({
    allowedRoles: ["admin"],
    voters: [basicAuthorization],
  })
  async delete(): Promise<void> {
    await this.reviewService.deleteAll();
  }
}
