import {Entity, belongsTo, model, property} from '@loopback/repository';
import {EntityWithId} from './entity-with-id.model';
import {User} from '../graphql-types';
import { Cart } from "./cart.model";


@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Order extends EntityWithId {

  @belongsTo(() => User)
  userId?: string;

  @belongsTo(() => Cart)
  cartId?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['pending', 'processing', 'completed', 'cancelled']
    },
  })
  status: string;


  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
