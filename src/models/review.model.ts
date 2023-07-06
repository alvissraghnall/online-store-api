import {belongsTo, model, property} from '@loopback/repository';
import {EntityWithId, Product} from '.';
import {User} from '../models';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Review extends EntityWithIdAndTimestamps {
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

  @belongsTo(() => User)
  userId?: string;

  @belongsTo(() => Product, {}, { required: true })
  productId: string;

  constructor(data?: Partial<Review>) {
    super(data);
  }
}

export interface ReviewRelations {
  // describe navigational properties here
}

export type ReviewWithRelations = Review & ReviewRelations;
