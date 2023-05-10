import {belongsTo, model, property} from '@loopback/repository';
import {EntityWithId, Product} from '.';
import {User} from '../models';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Review extends EntityWithId {
  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @belongsTo(() => User, {keyFrom: 'userId', keyTo: 'id', name: 'user'})
  userId?: string;

  @belongsTo(() => Product, {keyFrom: 'productId', name: 'product'})
  productId?: string;

  constructor(data?: Partial<Review>) {
    super(data);
  }
}

export interface ReviewRelations {
  // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
