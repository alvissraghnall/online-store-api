import {authenticate} from '@loopback/authentication'
import {UserRepository} from '@loopback/authentication-jwt'
import {inject} from '@loopback/context'
import {service} from '@loopback/core'
import {post, getModelSchemaRef, response, requestBody, SchemaObject} from '@loopback/openapi-v3'
import {repository} from '@loopback/repository'
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Product, User} from '../models'
import {PaymentService} from '../services'

type PaymentDetails = {
  amount: number,
  items: Product[]
}

const paystackTxnInitResponseSchema: SchemaObject = {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "paystackTxnInitResponse",
  type: "object",
  properties: {
    status: {
      type: "boolean",
    },
    message: {
      type: "string",
    },
    data: {
      type: "object",
      properties: {
        authorization_url: {
          type: "string",
        },
        access_code: {
          type: "string",
        },
        reference: {
          type: "string",
        },
      },
      required: ["authorization_url", "access_code", "reference"],
    },
  },
  required: ["status", "message", "data"],
};


@authenticate('jwt')
export class PaymentController {
  constructor(
    @service(PaymentService) private paymentService: PaymentService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
  ) {}

  @post('/payment')
  @response(200, {
    description: 'Payment initialization response',
    content: {'application/json': {schema: paystackTxnInitResponseSchema }},
  })
  pay (
    @requestBody({
      content: {
        'application/json': {
          schema: {
            $schema: "http://json-schema.org/draft-04/schema#",
            title: "req body for payment method",
            type: "object",
            properties: {
              amount: {
                title: "total amount",
                type: "number",
              }
            }
          }
        }
      }
    }) amount: number
  ) {
    return this.paymentService.makePayment(amount);
  }

}
