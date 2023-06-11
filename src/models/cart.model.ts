import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {User} from '../models';
import {CartItem} from './cart-item.model';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';

@model()
export class Cart extends EntityWithIdAndTimestamps {

  @belongsTo(() => User, {name: 'user'})
  userId: string;

  @property.array(CartItem)
  items?: CartItem[];

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
