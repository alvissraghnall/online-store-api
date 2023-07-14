import {authenticate} from '@loopback/authentication'
import {UserRepository} from '@loopback/authentication-jwt'
import {inject} from '@loopback/context'
import {service} from '@loopback/core'
import {post, getModelSchemaRef, response, requestBody} from '@loopback/openapi-v3'
import {repository} from '@loopback/repository'
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Product, User} from '../models'
import {PaymentService} from '../services'

type PaymentDetails = {
  amount: number,
  items: Product[]
}



@authenticate('jwt')
export class PaymentController {
  constructor(
    @service(PaymentService) private favouritesService: PaymentService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
  ) {}

  @post('/payment')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: {
      p
    }}},
  })
  pay () {

  }

}
